import prisma from "@/lib/prisma";
import { sendBookingConfirmationToN8N } from "@/lib/n8n";

export interface CreateBookingInput {
  name: string;
  email: string;
  company: string;
  date: string;
  timeSlot: string;
  workflowType: string;
  description: string;
}

export class BookingService {
  async createBooking(data: CreateBookingInput) {
    if (!data.name || !data.email || !data.company) {
      throw new Error("Name, email, and company are required");
    }

    const booking = await prisma.booking.create({
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

    // Notify n8n webhook after database record is successfully created.
    // Any n8n delivery error is handled gracefully inside the helper so the booking remains confirmed.
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
