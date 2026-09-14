import prisma from "@/lib/prisma";
import { sendBookingConfirmationToN8N } from "@/lib/n8n";
import { broadcastBookingEvent } from "@/lib/bookingEvents";

export interface CreateBookingInput {
  name: string;
  email: string;
  company: string;
  date: string;
  timeSlot: string;
  workflowType: string;
  description: string;
}

export interface CreateCustomRequestInput {
  name: string;
  email: string;
  company: string;
  preferredDate: string;
  preferredTime: string;
  workflowType?: string;
  notes?: string;
}

export class BookingService {
  async createBooking(data: CreateBookingInput) {
    if (!data.name || !data.email || !data.company) {
      throw new Error("Name, email, and company are required");
    }

    if (!data.date || !data.timeSlot) {
      throw new Error("Date and time slot are required");
    }

    // Atomic transaction: Revalidate availability and prevent concurrent race conditions
    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findFirst({
        where: {
          date: data.date,
          timeSlot: data.timeSlot,
          status: "CONFIRMED",
        },
      });

      if (existing) {
        throw new Error("That time was just booked. Please choose another available time.");
      }

      return tx.booking.create({
        data: {
          name: data.name,
          email: data.email,
          company: data.company,
          date: data.date,
          timeSlot: data.timeSlot,
          workflowType: data.workflowType || "General Discovery",
          description: data.description || "Review operational bottlenecks and potential automation targets.",
          status: "CONFIRMED",
        },
      });
    });

    // Broadcast real-time slot update via SSE to all listening clients
    broadcastBookingEvent({
      type: "slot_booked",
      date: booking.date,
      timeSlot: booking.timeSlot,
      bookingId: booking.id,
      timestamp: new Date().toISOString(),
    });

    // Notify n8n webhook after database record is successfully created.
    // Any n8n delivery error is handled gracefully inside the helper so the booking remains confirmed.
    await sendBookingConfirmationToN8N(booking);

    return booking;
  }

  async createCustomRequest(data: CreateCustomRequestInput) {
    if (!data.name || !data.email || !data.preferredDate || !data.preferredTime) {
      throw new Error("Name, email, preferred date, and preferred time are required");
    }

    const booking = await prisma.booking.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || "Pending Verification",
        date: data.preferredDate,
        timeSlot: data.preferredTime,
        workflowType: data.workflowType || "Custom Time Request",
        description: `[CUSTOM TIME REQUEST] ${data.notes || "Requested alternate session time outside standard availability."}`,
        status: "REQUESTED",
      },
    });

    // Notify n8n for custom request handling
    await sendBookingConfirmationToN8N(booking);

    return booking;
  }

  async listBookings() {
    return prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}

export const bookingService = new BookingService();
