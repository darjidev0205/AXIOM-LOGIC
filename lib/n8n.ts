import { Booking } from "@prisma/client";

export interface BookingWebhookPayload {
  name: string;
  email: string;
  bookingId: string;
  service: string;
  date: string;
  time: string;
}

export interface N8nWebhookResponse {
  success: boolean;
  status?: number;
  error?: string;
}

/**
 * Sends booking confirmation details to the configured n8n webhook.
 * This runs strictly server-side and never throws, ensuring database
 * bookings remain confirmed even if external webhook delivery fails.
 */
export async function sendBookingConfirmationToN8N(
  booking: Pick<Booking, "id" | "name" | "email" | "workflowType" | "date" | "timeSlot">
): Promise<N8nWebhookResponse> {
  const webhookUrl = process.env.N8N_BOOKING_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[n8n] N8N_BOOKING_WEBHOOK_URL is not set. Skipping webhook notification for booking:",
      booking.id
    );
    return {
      success: false,
      error: "N8N_BOOKING_WEBHOOK_URL is not configured",
    };
  }

  const payload: BookingWebhookPayload = {
    name: booking.name,
    email: booking.email,
    bookingId: booking.id,
    service: booking.workflowType,
    date: booking.date,
    time: booking.timeSlot,
  };

  try {
    console.log(`[n8n] Dispatching booking confirmation webhook for bookingId: ${booking.id}`);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10-second timeout for serverless environments
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        `[n8n] Webhook endpoint responded with HTTP ${response.status}: ${errorBody}`
      );
      return {
        success: false,
        status: response.status,
        error: `HTTP ${response.status}`,
      };
    }

    console.log(
      `[n8n] Booking confirmation webhook dispatched successfully (HTTP ${response.status}) for bookingId: ${booking.id}`
    );
    return {
      success: true,
      status: response.status,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown network error";
    console.error(`[n8n] Failed to dispatch webhook to n8n: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
