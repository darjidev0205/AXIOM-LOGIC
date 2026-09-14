import { bookingEventEmitter, BookingEventPayload } from "@/lib/bookingEvents";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  let keepAliveTimer: NodeJS.Timeout | null = null;
  let onBookingChange: ((payload: BookingEventPayload) => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection handshake
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`)
      );

      // Listen for booking updates
      onBookingChange = (payload: BookingEventPayload) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {
          // Stream might be closed
        }
      };

      bookingEventEmitter.on("booking_change", onBookingChange);

      // Heartbeat ping every 25 seconds to keep connection alive on serverless / Vercel
      keepAliveTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          if (keepAliveTimer) clearInterval(keepAliveTimer);
        }
      }, 25000);
    },
    cancel() {
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      if (onBookingChange) {
        bookingEventEmitter.off("booking_change", onBookingChange);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
