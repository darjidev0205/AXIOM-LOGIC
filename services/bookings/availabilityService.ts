import prisma from "@/lib/prisma";

export interface DateOption {
  label: string;      // e.g. "MON"
  day: string;        // e.g. "15"
  val: string;        // e.g. "Tue, Sep 15"
  iso: string;        // e.g. "2026-09-15"
  isToday: boolean;
  monthYear: string;  // e.g. "September 2026"
}

export interface SlotOption {
  id: string;          // Canonical slot ID (e.g. "2026-09-15T14:00:00Z")
  time: string;        // Display time in user's timezone, e.g. "10:00 AM"
  fullDisplay: string; // Display with timezone, e.g. "10:00 AM EDT"
  businessTime: string;// Original business slot (e.g. "10:00 AM EST")
  available: boolean;
  status: "available" | "selected" | "booked" | "past";
  reason?: "booked" | "past" | "holiday";
}

export interface DayAvailability {
  date: string;            // ISO format YYYY-MM-DD
  dateFormatted: string;   // e.g. "Tue, Sep 15"
  monthYear: string;       // e.g. "September 2026"
  userTimezone: string;
  businessTimezone: string;
  slots: SlotOption[];
  isFullyBooked: boolean;
  hasRemainingSlots: boolean;
}

// Configurable business operating parameters
export const BUSINESS_TIMEZONE = process.env.BOOKING_BUSINESS_TIMEZONE || "America/New_York";

// Standard business session slots (in 24h HH:mm within BUSINESS_TIMEZONE)
export const BUSINESS_SLOT_TIMES = [
  { hour: 9, minute: 0, label: "09:00 AM" },
  { hour: 10, minute: 0, label: "10:00 AM" },
  { hour: 11, minute: 30, label: "11:30 AM" },
  { hour: 14, minute: 0, label: "02:00 PM" },
  { hour: 15, minute: 30, label: "03:30 PM" },
  { hour: 16, minute: 30, label: "04:30 PM" },
];

/**
 * Calculates a precise UTC Date for a given date in YYYY-MM-DD and an hour/minute in a specific timezone.
 */
export function getUtcDateForTimezone(
  dateIso: string,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const [year, month, day] = dateIso.split("-").map(Number);
  // Create an initial guess in UTC
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));

  // Determine the offset difference between UTC and target timezone at this moment
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(guess);
  const findPart = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0);

  const tzYear = findPart("year");
  const tzMonth = findPart("month");
  const tzDay = findPart("day");
  let tzHour = findPart("hour");
  if (tzHour === 24) tzHour = 0;
  const tzMinute = findPart("minute");

  const tzDate = new Date(Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, 0, 0));
  const diffMs = tzDate.getTime() - guess.getTime();

  return new Date(guess.getTime() - diffMs);
}

/**
 * Generates dynamic available business dates starting from today or an offset.
 * Skips weekends (Saturday & Sunday).
 */
export function getDynamicAvailableDates(
  startDate: Date = new Date(),
  offsetDays: number = 0,
  count: number = 6,
  userTimezone: string = "America/New_York"
): DateOption[] {
  const dates: DateOption[] = [];
  const current = new Date(startDate);
  current.setDate(current.getDate() + offsetDays);

  const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: userTimezone }).format(new Date());

  while (dates.length < count) {
    const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday

    // Only include weekdays (Monday - Friday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const iso = new Intl.DateTimeFormat("en-CA", { timeZone: userTimezone }).format(current);

      // Do not allow dates in the past
      if (iso >= todayStr) {
        const label = new Intl.DateTimeFormat("en-US", {
          timeZone: userTimezone,
          weekday: "short",
        }).format(current).toUpperCase();

        const dayNum = new Intl.DateTimeFormat("en-US", {
          timeZone: userTimezone,
          day: "numeric",
        }).format(current);

        const val = new Intl.DateTimeFormat("en-US", {
          timeZone: userTimezone,
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(current);

        const monthYear = new Intl.DateTimeFormat("en-US", {
          timeZone: userTimezone,
          month: "long",
          year: "numeric",
        }).format(current);

        dates.push({
          label,
          day: dayNum,
          val,
          iso,
          isToday: iso === todayStr,
          monthYear,
        });
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Retrieves dynamic available slots for a given date and user timezone.
 * Queries PostgreSQL to mark booked slots unavailable.
 */
export async function getSlotsForDate(
  dateIso: string,
  userTimezone: string = BUSINESS_TIMEZONE
): Promise<DayAvailability> {
  const [year, month, day] = dateIso.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  const monthYear = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimezone,
    month: "long",
    year: "numeric",
  }).format(localDate);

  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(localDate);

  // Query existing confirmed bookings for this date in PostgreSQL
  const existingBookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      OR: [
        { date: dateIso },
        { date: dateFormatted },
        { description: { contains: dateIso } },
      ],
    },
    select: {
      id: true,
      timeSlot: true,
      description: true,
    },
  });

  const bookedTimeSlots = new Set(existingBookings.map((b) => b.timeSlot.trim().toLowerCase()));

  const now = new Date();
  const bufferMs = 15 * 60 * 1000; // 15-minute booking buffer

  const slots: SlotOption[] = BUSINESS_SLOT_TIMES.map((slotTime) => {
    const slotUtc = getUtcDateForTimezone(
      dateIso,
      slotTime.hour,
      slotTime.minute,
      BUSINESS_TIMEZONE
    );

    // Format in user's local timezone
    const timeDisplay = new Intl.DateTimeFormat("en-US", {
      timeZone: userTimezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(slotUtc);

    const tzShort = new Intl.DateTimeFormat("en-US", {
      timeZone: userTimezone,
      timeZoneName: "short",
    })
      .formatToParts(slotUtc)
      .find((p) => p.type === "timeZoneName")?.value || "";

    const fullDisplay = `${timeDisplay} ${tzShort}`.trim();
    const businessTime = `${slotTime.label} EST`;

    // Check if slot has already passed
    const isPast = slotUtc.getTime() <= now.getTime() + bufferMs;

    // Check if slot is already booked in database
    const isBooked =
      bookedTimeSlots.has(fullDisplay.toLowerCase()) ||
      bookedTimeSlots.has(timeDisplay.toLowerCase()) ||
      bookedTimeSlots.has(businessTime.toLowerCase()) ||
      existingBookings.some((b) => b.description?.includes(slotUtc.toISOString()));

    let status: SlotOption["status"] = "available";
    let reason: SlotOption["reason"];

    if (isPast) {
      status = "past";
      reason = "past";
    } else if (isBooked) {
      status = "booked";
      reason = "booked";
    }

    return {
      id: slotUtc.toISOString(),
      time: fullDisplay,
      fullDisplay,
      businessTime,
      available: !isPast && !isBooked,
      status,
      reason,
    };
  });

  const availableCount = slots.filter((s) => s.available).length;

  return {
    date: dateIso,
    dateFormatted,
    monthYear,
    userTimezone,
    businessTimezone: BUSINESS_TIMEZONE,
    slots,
    isFullyBooked: availableCount === 0,
    hasRemainingSlots: availableCount > 0,
  };
}
