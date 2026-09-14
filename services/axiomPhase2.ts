/**
 * AXIOM LOGIC — PHASE 2 PRE-MEETING INTELLIGENCE SERVICE LAYER
 * 
 * Provides isolated, robust client-side integration for the two dedicated n8n workflows:
 * 1. Post-Booking Workflow: /webhook/axiom/post-booking
 * 2. Architecture Intake Workflow: /webhook/axiom/architecture-intake
 * 
 * Rules:
 * - Does NOT modify existing Phase 1 booking flow or confirmation emails.
 * - Idempotency is keyed on booking_id.
 * - Never throws uncaught errors into the booking UI.
 * - Zero exposure of internal AI scores or n8n technical IDs.
 */

// ============================================================
// ENVIRONMENT CONFIGURATION WITH SAFE PRODUCTION DEFAULTS
// ============================================================

const POST_BOOKING_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_AXIOM_POST_BOOKING_WEBHOOK_URL ||
  "https://dev21212.app.n8n.cloud/webhook/axiom/post-booking";

const ARCHITECTURE_INTAKE_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_AXIOM_ARCHITECTURE_INTAKE_WEBHOOK_URL ||
  "https://dev21212.app.n8n.cloud/webhook/axiom/architecture-intake";

// ============================================================
// TYPES & CONTRACTS
// ============================================================

export interface AxiomPostBookingPayload {
  // Exact fields expected by n8n '02 - Validate Booking':
  name: string;
  email: string;
  bookingId: string;
  service: string;
  date: string;
  time: string;
  company: string;
  timezone: string;
  status: string;

  // Dual compatibility fields:
  booking_id: string;
  full_name: string;
  work_email: string;
  company_name: string;
  booking_date: string;
  booking_time: string;
  primary_workflow_area: string;
  initial_bottleneck: string;
}

export interface PostBookingResult {
  success: boolean;
  message?: string;
  error?: string;
  status?: number;
}

export interface AxiomArchitectureIntakePayload {
  axiom_lead_id: string;
  questionnaire_token: string;
  full_name: string;
  work_email: string;
  company_name: string;
  systems_involved: string[];
  other_systems: string;
  workflow_description: string;
  primary_bottleneck: string;
  manual_hours_per_week: string;
  weekly_volume: string;
  error_frequency: string;
  repetition_score: number;
  current_automation_level: number;
  business_impact: string;
  existing_automation_tools: string[];
  security_requirements: string[];
  security_notes: string;
  success_definition: string;
}

export type IntakeSubmissionStatus =
  | "success"
  | "invalid_token"
  | "validation_error"
  | "already_completed"
  | "network_error";

export interface IntakeSubmissionResult {
  success: boolean;
  status: number;
  resultType: IntakeSubmissionStatus;
  message: string;
}

// In-memory set of already processed booking IDs to protect against duplicate triggers
// across React re-renders, component remounts, or state updates in the same session.
const processedBookingIds = new Set<string>();

// ============================================================
// ADAPTER: BUILD POST-BOOKING PAYLOAD FROM EXISTING BOOKING MODEL
// ============================================================

export function buildAxiomPostBookingPayload(booking: {
  id: string;
  name: string;
  email: string;
  company: string;
  date: string;
  timeSlot: string;
  timeZone?: string;
  timezone?: string;
  workflowType?: string;
  description?: string;
}): AxiomPostBookingPayload {
  const name = (booking.name || "").trim();
  const email = (booking.email || "").trim();
  const company = (booking.company || "").trim() || "Enterprise Operations";
  const date = booking.date || "";
  const time = booking.timeSlot || "";
  const timezone = booking.timeZone || booking.timezone || "America/New_York";
  const service = booking.workflowType || "Lead Automation";
  const bottleneck = booking.description || "Review operational bottlenecks and potential automation targets.";
  const bookingId = booking.id || "";

  return {
    // Exact fields read by n8n '02 - Validate Booking'
    name,
    email,
    bookingId,
    service,
    date,
    time,
    company,
    timezone,
    status: "confirmed",

    // Compatible snake_case fields
    booking_id: bookingId,
    full_name: name,
    work_email: email,
    company_name: company,
    booking_date: date,
    booking_time: time,
    primary_workflow_area: service,
    initial_bottleneck: bottleneck,
  };
}

// ============================================================
// FUNCTION 1: POST-BOOKING TRIGGER (CALLED AFTER BOOKING SUCCESS)
// ============================================================

/**
 * Dispatches post-booking notification to the Phase 2 n8n workflow.
 * This runs AFTER the booking is successfully committed and confirmed in the database.
 * 
 * Resilient behavior:
 * Even if n8n is temporarily unavailable or errors, this function catches the error,
 * logs appropriately for development observability, and returns a non-blocking result.
 * The customer's confirmed booking is NEVER marked as failed.
 */
export async function postBookingToAxiom(
  payload: AxiomPostBookingPayload
): Promise<PostBookingResult> {
  const bookingId = payload.booking_id;

  // Frontend duplicate protection check
  if (!bookingId) {
    console.warn("[AXIOM Phase 2] Cannot dispatch post-booking: missing booking_id");
    return { success: false, error: "Missing booking_id" };
  }

  if (processedBookingIds.has(bookingId)) {
    console.log(`[AXIOM Phase 2] Post-booking already dispatched for booking_id: ${bookingId}. Skipping duplicate.`);
    return { success: true, message: "Already processed" };
  }

  // Check sessionStorage UX deduplication flag if running in browser
  if (typeof window !== "undefined") {
    try {
      const storageKey = `axiom_p2_booking_${bookingId}`;
      if (sessionStorage.getItem(storageKey)) {
        console.log(`[AXIOM Phase 2] Found session deduplication mark for ${bookingId}. Skipping duplicate.`);
        processedBookingIds.add(bookingId);
        return { success: true, message: "Already processed in session" };
      }
      sessionStorage.setItem(storageKey, "dispatched");
    } catch {
      // Ignore sessionStorage access errors (e.g. strict privacy modes)
    }
  }

  // Mark in memory immediately before network dispatch
  processedBookingIds.add(bookingId);

  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("[AXIOM Phase 2] Post-booking request started for booking:", bookingId);
    }

    const response = await fetch(POST_BOOKING_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text().catch(() => "");

    if (process.env.NODE_ENV !== "production") {
      console.log(`[AXIOM Phase 2] Post-booking response status: ${response.status}`);
    }

    if (!response.ok) {
      console.warn(
        `[AXIOM Phase 2] Post-booking webhook returned HTTP ${response.status}: ${responseText}`
      );
      return {
        success: false,
        status: response.status,
        error: `HTTP ${response.status}`,
      };
    }

    // Safely parse JSON response if available; n8n post-booking workflow returns {"message":"Workflow was started"}
    let message = "Workflow was started";
    try {
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed.message) message = parsed.message;
      }
    } catch {
      // Body was plain text or empty, keep default message
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[AXIOM Phase 2] Post-booking request succeeded.");
    }

    return {
      success: true,
      status: response.status,
      message,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network error";
    console.error("[AXIOM Phase 2] Failed to dispatch post-booking webhook:", errorMsg);
    // Never throw: booking remains confirmed
    return {
      success: false,
      error: errorMsg,
    };
  }
}

// ============================================================
// FUNCTION 2: ARCHITECTURE INTAKE SUBMISSION
// ============================================================

/**
 * Submits the completed Pre-Meeting Architecture Intake questionnaire
 * to the Phase 2 n8n workflow.
 * 
 * Accurately categorizes errors (invalid token, missing fields, already completed, network error)
 * without losing customer responses.
 */
export async function submitArchitectureIntake(
  payload: AxiomArchitectureIntakePayload
): Promise<IntakeSubmissionResult> {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("[AXIOM Phase 2] Architecture intake submission started.");
    }

    const response = await fetch(ARCHITECTURE_INTAKE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text().catch(() => "");
    let responseJson: Record<string, unknown> = {};

    try {
      if (responseText) {
        responseJson = JSON.parse(responseText);
      }
    } catch {
      // Non-JSON response
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[AXIOM Phase 2] Architecture intake response status: ${response.status}`);
    }

    const resMessage = typeof responseJson.message === "string" ? responseJson.message : "";

    // 1. Success (200 - 204)
    if (response.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[AXIOM Phase 2] Architecture intake submission succeeded.");
      }
      return {
        success: true,
        status: response.status,
        resultType: "success",
        message: resMessage || "Thank you. We've received your workflow information.",
      };
    }

    // 2. Token Verification Failed (403 or message contains token / verify)
    if (
      response.status === 403 ||
      resMessage.toLowerCase().includes("verify your intake link")
    ) {
      console.warn("[AXIOM Phase 2] Architecture intake link could not be verified (403).");
      return {
        success: false,
        status: response.status,
        resultType: "invalid_token",
        message:
          resMessage ||
          "We could not verify your intake link. Please use the link from your invitation email.",
      };
    }

    // 3. Already Completed (409 or message mentions completed/already)
    if (
      response.status === 409 ||
      resMessage.toLowerCase().includes("already") ||
      resMessage.toLowerCase().includes("completed")
    ) {
      return {
        success: false,
        status: response.status,
        resultType: "already_completed",
        message:
          resMessage ||
          "This architecture intake has already been completed for your upcoming session.",
      };
    }

    // 4. Missing Required Information (400)
    if (response.status === 400) {
      return {
        success: false,
        status: response.status,
        resultType: "validation_error",
        message: resMessage || "Some required information is missing.",
      };
    }

    // 5. Other Server / Webhook Error
    return {
      success: false,
      status: response.status,
      resultType: "network_error",
      message: "We couldn't submit your intake right now. Your answers are still here. Please try again.",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network failure";
    console.error("[AXIOM Phase 2] Architecture intake submission failed:", errorMsg);

    return {
      success: false,
      status: 0,
      resultType: "network_error",
      message: "We couldn't submit your intake right now. Your answers are still here. Please try again.",
    };
  }
}
