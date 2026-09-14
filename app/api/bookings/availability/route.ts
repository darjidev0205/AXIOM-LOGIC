import { NextResponse } from "next/server";
import {
  getDynamicAvailableDates,
  getSlotsForDate,
  BUSINESS_TIMEZONE,
} from "@/services/bookings/availabilityService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get("timezone") || BUSINESS_TIMEZONE;
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

    // Get current available dates starting from today + offset
    const availableDates = getDynamicAvailableDates(new Date(), offset, 6, timezone);

    // Requested date, defaulting to the first available date
    let requestedDateIso = searchParams.get("date");
    if (!requestedDateIso || !availableDates.some((d) => d.iso === requestedDateIso)) {
      requestedDateIso = availableDates[0]?.iso || new Date().toISOString().split("T")[0];
    }

    // Get slots for the requested date
    let dayAvailability = await getSlotsForDate(requestedDateIso, timezone);

    // If today was selected but has no remaining slots (all past or booked), find next available day
    let nextAvailableDate: string | undefined;
    if (!dayAvailability.hasRemainingSlots) {
      for (const d of availableDates) {
        if (d.iso !== requestedDateIso) {
          const checkAvailability = await getSlotsForDate(d.iso, timezone);
          if (checkAvailability.hasRemainingSlots) {
            nextAvailableDate = d.iso;
            break;
          }
        }
      }

      // If user didn't explicitly request a specific date, auto-advance to next available date
      if (!searchParams.get("date") && nextAvailableDate) {
        requestedDateIso = nextAvailableDate;
        dayAvailability = await getSlotsForDate(requestedDateIso, timezone);
      }
    }

    return NextResponse.json({
      dates: availableDates,
      selectedDate: requestedDateIso,
      availability: dayAvailability,
      nextAvailableDate,
      userTimezone: timezone,
      businessTimezone: BUSINESS_TIMEZONE,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error retrieving availability";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
