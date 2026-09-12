import { NextResponse } from "next/server";
import { bookingService } from "@/services/bookings/bookingService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const booking = await bookingService.createBooking({
      name: body.name,
      email: body.email,
      company: body.company,
      date: body.date,
      timeSlot: body.timeSlot,
      workflowType: body.workflowType,
      description: body.description,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating booking";
    return NextResponse.json({ error: message }, { status: 400 });
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
