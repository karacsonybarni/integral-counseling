import { APPS_SCRIPT_WEB_APP_URL } from "@/lib/formSubmission";

const APPS_SCRIPT_MESSAGE_SOURCE = "integral-counseling-apps-script";
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
  const iframe = document.createElement("iframe");
  const url = new URL(APPS_SCRIPT_WEB_APP_URL);

  url.searchParams.set("action", "availability");
  url.searchParams.set("origin", window.location.origin);
  url.searchParams.set("requestId", requestId);

  iframe.src = url.toString();
  iframe.style.display = "none";
  iframe.title = "";

  return new Promise<CalendarAvailability>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timeoutId);
      iframe.remove();
    };

    const finish = (callback: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      callback();
    };

    const handleMessage = (event: MessageEvent<AvailabilityMessage>) => {
      if (!isTrustedAppsScriptOrigin(event.origin)) {
        return;
      }

      const message = event.data;
      if (
        !message ||
        message.source !== APPS_SCRIPT_MESSAGE_SOURCE ||
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

    const timeoutId = window.setTimeout(() => {
      finish(() => reject(new Error("Timed out while loading calendar availability.")));
    }, APPS_SCRIPT_TIMEOUT_MS);

    window.addEventListener("message", handleMessage);
    document.body.appendChild(iframe);
  });
}

function isTrustedAppsScriptOrigin(origin: string) {
  try {
    const { protocol, host } = new URL(origin);
    return (
      protocol === "https:" &&
      (host === "script.google.com" ||
        host === "script.googleusercontent.com" ||
        host.endsWith(".googleusercontent.com"))
    );
  } catch {
    return false;
  }
}
