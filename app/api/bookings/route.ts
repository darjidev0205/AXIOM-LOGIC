import { NextResponse } from "next/server";
import { bookingService } from "@/services/bookings/bookingService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a custom time request
    if (body.isCustomRequest || body.action === "request_time") {
      const { booking, n8nResult } = await bookingService.createCustomRequest({
        name: body.name,
        email: body.email,
        company: body.company,
        preferredDate: body.date || body.preferredDate,
        preferredTime: body.timeSlot || body.preferredTime,
        workflowType: body.workflowType,
        notes: body.description || body.notes,
        timeZone: body.timeZone || body.timezone,
      });

      return NextResponse.json(
        {
          ...booking,
          n8nSuccess: n8nResult.success,
          n8nStatus: n8nResult.status,
          emailMessage: n8nResult.message,
          emailError: n8nResult.error,
        },
        { status: 201 }
      );
    }

    // Standard atomic booking creation with concurrency check
    const { booking, n8nResult } = await bookingService.createBooking({
      name: body.name,
      email: body.email,
      company: body.company,
      date: body.date,
      timeSlot: body.timeSlot,
      workflowType: body.workflowType,
      description: body.description,
      timeZone: body.timeZone || body.timezone,
    });

    return NextResponse.json(
      {
        ...booking,
        n8nSuccess: n8nResult.success,
        n8nStatus: n8nResult.status,
        emailMessage: n8nResult.message,
        emailError: n8nResult.error,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating booking";
    const isConflict = message.includes("That time was just booked") || message.includes("already booked");
    return NextResponse.json({ error: message }, { status: isConflict ? 409 : 400 });
  }
}

export async function GET() {
  try {
    const bookings = await bookingService.listBookings();
    return NextResponse.json(bookings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching bookings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
