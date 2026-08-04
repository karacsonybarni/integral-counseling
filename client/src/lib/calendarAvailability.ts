import { APPS_SCRIPT_WEB_APP_URL } from "@/lib/formSubmission";

const APPS_SCRIPT_TIMEOUT_MS = 15000;

interface AvailabilityMessage {
  source?: string;
  ok?: boolean;
  error?: string;
  requestId?: string;
  slots?: string[];
  timeZone?: string;
}

export interface CalendarAvailability {
  slots: string[];
  timeZone: string;
}

export async function getCalendarAvailability(): Promise<CalendarAvailability> {
  if (typeof document === "undefined" || typeof window === "undefined") {
    throw new Error("Calendar availability requires a browser environment.");
  }

  const requestId = `availability_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const callbackName = `integralCalendarAvailability_${requestId}`;
  const callbacks = window as unknown as Record<
    string,
    ((message: AvailabilityMessage) => void) | undefined
  >;
  const script = document.createElement("script");
  const url = new URL(APPS_SCRIPT_WEB_APP_URL);

  url.searchParams.set("action", "availability");
  url.searchParams.set("requestId", requestId);
  url.searchParams.set("callback", callbackName);

  return new Promise<CalendarAvailability>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      script.remove();
      delete callbacks[callbackName];
    };

    const finish = (callback: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      callback();
    };

    callbacks[callbackName] = (message: AvailabilityMessage) => {
      if (
        !message ||
        message.requestId !== requestId
      ) {
        return;
      }

      if (!message.ok) {
        finish(() => reject(new Error(message.error || "Could not load calendar availability.")));
        return;
      }

      finish(() =>
        resolve({
          slots: Array.isArray(message.slots) ? message.slots : [],
          timeZone: message.timeZone || "Europe/Budapest",
        }),
      );
    };

    script.onerror = () => {
      finish(() => reject(new Error("Could not load calendar availability.")));
    };

    const timeoutId = window.setTimeout(() => {
      finish(() => reject(new Error("Timed out while loading calendar availability.")));
    }, APPS_SCRIPT_TIMEOUT_MS);

    script.src = url.toString();
    script.async = true;
    document.head.appendChild(script);
  });
}
