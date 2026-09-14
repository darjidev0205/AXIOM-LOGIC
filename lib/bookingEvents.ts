import { EventEmitter } from "events";

// Global singleton for real-time booking event broadcasting in Node.js runtime
declare global {
  // eslint-disable-next-line no-var
  var __bookingEventEmitter: EventEmitter | undefined;
}

export const bookingEventEmitter =
  globalThis.__bookingEventEmitter || (globalThis.__bookingEventEmitter = new EventEmitter());

// Ensure maximum listeners doesn't warn under high client connections
bookingEventEmitter.setMaxListeners(200);

export interface BookingEventPayload {
  type: "slot_booked" | "slot_released";
  date: string;
  timeSlot: string;
  bookingId?: string;
  timestamp: string;
}

export function broadcastBookingEvent(payload: BookingEventPayload) {
  bookingEventEmitter.emit("booking_change", payload);
}
