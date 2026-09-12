import prisma from "@/lib/prisma";

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

    return booking;
  }

  async listBookings() {
    return prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}

export const bookingService = new BookingService();
