const DEFAULT_APPS_SCRIPT_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbztbd9BZ55jNSTu4TIGgwk4mvIHteoyPhiB_qbzvRl4MM7T5XYq1axQNxhbudFutvht/exec";
export const APPS_SCRIPT_WEB_APP_URL =
  import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL?.trim() ||
  DEFAULT_APPS_SCRIPT_WEB_APP_URL;
const APPS_SCRIPT_MESSAGE_SOURCE = "integral-counseling-apps-script";
const APPS_SCRIPT_TIMEOUT_MS = 60000;

type FormType = "appointment" | "contact";

interface WebsiteFormPayload {
  formType: FormType;
  language: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredContact?: string;
  preferredContactLabel?: string;
  preferredDate?: string;
  preferredDateLabel?: string;
  preferredTime?: string;
  slotStart?: string;
  startedAt: number;
  website?: string;
}

interface AppsScriptMessage {
  source?: string;
  ok?: boolean;
  ignored?: boolean;
  error?: string;
  errorCode?: string;
  requestId?: string;
}

export class WebsiteFormSubmissionError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "WebsiteFormSubmissionError";
  }
}

export async function submitWebsiteForm(payload: WebsiteFormPayload) {
  await submitToAppsScript(payload);
}

async function submitToAppsScript(payload: WebsiteFormPayload) {
  if (!APPS_SCRIPT_WEB_APP_URL) {
    throw new Error("Apps Script endpoint is not configured.");
  }

  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  await new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      reject(new Error("Form submission requires a browser environment."));
      return;
    }

    let settled = false;
    const iframe = document.createElement("iframe");
    const form = document.createElement("form");
    const iframeName = `apps-script-form-target-${requestId}`;

    iframe.name = iframeName;
    iframe.style.display = "none";

    form.method = "POST";
    form.action = APPS_SCRIPT_WEB_APP_URL;
    form.target = iframeName;
    form.style.display = "none";

    const payloadEntries: Record<string, string> = {
      requestId,
      origin: window.location.origin,
      ...stringifyPayload(payload),
    };

    for (const [name, value] of Object.entries(payloadEntries)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timeoutId);
      form.remove();
      iframe.remove();
    };

    const resolveOnce = () => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve();
    };

    const rejectOnce = (error: Error) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(error);
    };

    const handleMessage = (event: MessageEvent<AppsScriptMessage>) => {
      // HtmlService runs the callback in a nested googleusercontent sandbox, so
      // its window is a descendant of the submission iframe rather than the
      // iframe window itself. The trusted origin and request ID correlate it.
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

      if (message.ok && !message.ignored) {
        resolveOnce();
        return;
      }

      rejectOnce(
        new WebsiteFormSubmissionError(
          message.ignored
            ? "Apps Script ignored the submission as suspected spam."
            : message.error || "Apps Script rejected the submission.",
          message.errorCode,
        ),
      );
    };

    const timeoutId = window.setTimeout(() => {
      rejectOnce(new Error("Timed out while waiting for the Apps Script response."));
    }, APPS_SCRIPT_TIMEOUT_MS);

    window.addEventListener("message", handleMessage);
    document.body.appendChild(iframe);
    document.body.appendChild(form);

    try {
      form.submit();
    } catch (error) {
      rejectOnce(
        error instanceof Error
          ? error
          : new Error("Failed to submit the hidden form to Apps Script."),
      );
    }
  });
}

function stringifyPayload(payload: WebsiteFormPayload) {
  const entries: Record<string, string> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) {
      continue;
    }

    entries[key] = String(value);
  }

  return entries;
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
