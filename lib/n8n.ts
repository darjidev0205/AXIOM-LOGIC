export interface BookingInputForN8n {
  id: string;
  name: string;
  email: string;
  company: string;
  date: string;
  timeSlot: string;
  workflowType: string;
  description: string;
  status?: string;
  timeZone?: string;
  isCustomRequest?: boolean;
}

export interface N8nWebhookResponse {
  success: boolean;
  status?: number;
  message?: string;
  error?: string;
}

/**
 * Sends booking confirmation details to the configured n8n webhook.
 * This runs strictly server-side and never throws, ensuring database
 * bookings remain confirmed even if external webhook delivery fails.
 */
export async function sendBookingConfirmationToN8N(
  booking: BookingInputForN8n
): Promise<N8nWebhookResponse> {
  const webhookUrl = process.env.N8N_BOOKING_WEBHOOK_URL;

  // Strict email validation to prevent sending empty/invalid emails to n8n
  const email = (booking.email || "").trim();
  if (!email || !email.includes("@")) {
    console.error("[n8n] Invalid or missing email address in booking record:", booking.email);
    return {
      success: false,
      error: "Invalid or missing email address provided for booking confirmation",
    };
  }

  if (!webhookUrl) {
    console.warn(
      "[n8n] N8N_BOOKING_WEBHOOK_URL is not set in environment. Skipping webhook notification for booking:",
      booking.id
    );
    return {
      success: false,
      error: "N8N_BOOKING_WEBHOOK_URL is not configured",
    };
  }

  // Comprehensive payload preserving all existing and anticipated n8n expression mappings
  const payload = {
    // Customer Identity (supports both {{$json.name}} and {{$json.fullName}})
    name: booking.name,
    fullName: booking.name,

    // Work Email (supports both {{$json.email}} and {{$json.workEmail}})
    email: email,
    workEmail: email,

    // Company Information (supports both {{$json.company}} and {{$json.companyName}})
    company: booking.company,
    companyName: booking.company,

    // Workflow / Service Domain (supports {{$json.service}}, {{$json.workflowType}}, and {{$json.primaryWorkflowArea}})
    service: booking.workflowType,
    workflowType: booking.workflowType,
    primaryWorkflowArea: booking.workflowType,

    // Bottleneck Description (supports both {{$json.description}} and {{$json.bottleneck}})
    description: booking.description,
    bottleneck: booking.description,

    // Selected Date (supports both {{$json.date}} and {{$json.selectedDate}})
    date: booking.date,
    selectedDate: booking.date,

    // Selected Time (supports {{$json.time}}, {{$json.timeSlot}}, and {{$json.selectedTime}})
    time: booking.timeSlot,
    timeSlot: booking.timeSlot,
    selectedTime: booking.timeSlot,

    // Time Zone (supports {{$json.timeZone}} and {{$json.timezone}})
    timeZone: booking.timeZone || "America/New_York",
    timezone: booking.timeZone || "America/New_York",

    // Booking Telemetry
    bookingId: booking.id,
    id: booking.id,
    status: booking.status || "CONFIRMED",
    isCustomRequest: booking.status === "REQUESTED" || Boolean(booking.isCustomRequest),
    dispatchedAt: new Date().toISOString(),
  };

  try {
    console.log(`[n8n] ==================== DISPATCHING WEBHOOK ====================`);
    console.log(`[n8n] Target URL: ${webhookUrl}`);
    console.log(`[n8n] Booking ID: ${booking.id}`);
    console.log(`[n8n] Work Email: ${payload.email}`);
    console.log(`[n8n] Payload Data:`, JSON.stringify(payload, null, 2));

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10-second timeout for serverless environments
    });

    const responseText = await response.text().catch(() => "");
    console.log(`[n8n] Webhook Response Status: ${response.status} ${response.statusText}`);
    console.log(`[n8n] Webhook Response Body: ${responseText}`);
    console.log(`[n8n] ==============================================================`);

    if (!response.ok) {
      console.error(
        `[n8n] Webhook endpoint responded with HTTP ${response.status}: ${responseText}`
      );
      return {
        success: false,
        status: response.status,
        error: `n8n webhook error HTTP ${response.status}: ${responseText || response.statusText}`,
      };
    }

    let parsedMessage = "Booking confirmation email dispatched successfully";
    try {
      const jsonRes = JSON.parse(responseText);
      if (jsonRes.message) parsedMessage = jsonRes.message;
    } catch {
      // Use default message
    }

    return {
      success: true,
      status: response.status,
      message: parsedMessage,
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
