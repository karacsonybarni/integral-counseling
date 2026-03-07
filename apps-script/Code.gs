const RESPONSE_SOURCE = "integral-counseling-apps-script";
const RECIPIENT_EMAIL = "karacsony.barni@gmail.com";
const MIN_SUBMISSION_DELAY_MS = 3000;

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      service: "integral-counseling-form-handler",
      timestamp: new Date().toISOString(),
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const requestId = cleanString_(e && e.parameter && e.parameter.requestId);
  const targetOrigin = normalizeOrigin_(
    cleanString_(e && e.parameter && e.parameter.origin),
  );

  try {
    const payload = normalizePayload_(e);

    if (shouldIgnoreSubmission_(payload)) {
      return createIframeResponse_({
        ok: true,
        ignored: true,
        requestId: requestId,
      }, targetOrigin);
    }

    validatePayload_(payload);

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: buildSubject_(payload),
      body: buildPlainTextBody_(payload),
      htmlBody: buildHtmlBody_(payload),
      replyTo: payload.email,
      name: "Integral Counseling Website",
    });

    return createIframeResponse_({
      ok: true,
      requestId: requestId,
    }, targetOrigin);
  } catch (error) {
    console.error("Failed to handle website form submission", error);

    return createIframeResponse_({
      ok: false,
      requestId: requestId,
      error: error && error.message ? error.message : String(error),
    }, targetOrigin);
  }
}

function normalizePayload_(e) {
  const params = (e && e.parameter) || {};

  return {
    formType: cleanString_(params.formType),
    language: cleanString_(params.language) === "en" ? "en" : "hu",
    name: cleanString_(params.name),
    email: cleanString_(params.email),
    phone: cleanString_(params.phone),
    message: cleanString_(params.message),
    preferredContact: cleanString_(params.preferredContact),
    preferredContactLabel: cleanString_(params.preferredContactLabel),
    preferredDate: cleanString_(params.preferredDate),
    preferredDateLabel: cleanString_(params.preferredDateLabel),
    preferredTime: cleanString_(params.preferredTime),
    startedAt: Number(params.startedAt || 0),
    website: cleanString_(params.website),
    receivedAt: new Date(),
  };
}

function shouldIgnoreSubmission_(payload) {
  if (payload.website) {
    return true;
  }

  if (!payload.startedAt) {
    return false;
  }

  return Date.now() - payload.startedAt < MIN_SUBMISSION_DELAY_MS;
}

function validatePayload_(payload) {
  if (payload.formType !== "appointment" && payload.formType !== "contact") {
    throw new Error("Unsupported form type.");
  }

  if (!payload.name) {
    throw new Error("Name is required.");
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new Error("A valid email address is required.");
  }

  if (payload.formType === "appointment") {
    if (!payload.preferredDate) {
      throw new Error("Preferred date is required.");
    }

    if (!payload.preferredTime) {
      throw new Error("Preferred time is required.");
    }
  }

  if (payload.formType === "contact" && !payload.message) {
    throw new Error("Message is required.");
  }
}

function buildSubject_(payload) {
  if (payload.formType === "appointment") {
    return "Website appointment request from " + payload.name;
  }

  return "Website contact request from " + payload.name;
}

function buildPlainTextBody_(payload) {
  const lines = [
    "Website form submission",
    "",
    "Type: " + (payload.formType === "appointment" ? "Appointment request" : "Contact message"),
    "Language: " + payload.language,
    "Name: " + payload.name,
    "Email: " + payload.email,
  ];

  if (payload.phone) {
    lines.push("Phone: " + payload.phone);
  }

  if (payload.preferredContactLabel) {
    lines.push("Preferred contact: " + payload.preferredContactLabel);
  }

  if (payload.preferredDateLabel) {
    lines.push("Preferred date: " + payload.preferredDateLabel);
  } else if (payload.preferredDate) {
    lines.push("Preferred date: " + payload.preferredDate);
  }

  if (payload.preferredTime) {
    lines.push("Preferred time: " + payload.preferredTime);
  }

  if (payload.message) {
    lines.push("");
    lines.push("Message:");
    lines.push(payload.message);
  }

  lines.push("");
  lines.push("Received at: " + payload.receivedAt.toISOString());

  return lines.join("\n");
}

function buildHtmlBody_(payload) {
  const sections = [
    "<h2>Website form submission</h2>",
    "<table cellpadding=\"6\" cellspacing=\"0\" border=\"1\" style=\"border-collapse:collapse;border-color:#d1d5db;\">",
    "<tr><th align=\"left\">Type</th><td>" + escapeHtml_(payload.formType === "appointment" ? "Appointment request" : "Contact message") + "</td></tr>",
    "<tr><th align=\"left\">Language</th><td>" + escapeHtml_(payload.language) + "</td></tr>",
    "<tr><th align=\"left\">Name</th><td>" + escapeHtml_(payload.name) + "</td></tr>",
    "<tr><th align=\"left\">Email</th><td>" + escapeHtml_(payload.email) + "</td></tr>",
  ];

  if (payload.phone) {
    sections.push("<tr><th align=\"left\">Phone</th><td>" + escapeHtml_(payload.phone) + "</td></tr>");
  }

  if (payload.preferredContactLabel) {
    sections.push(
      "<tr><th align=\"left\">Preferred contact</th><td>" +
        escapeHtml_(payload.preferredContactLabel) +
        "</td></tr>",
    );
  }

  if (payload.preferredDateLabel || payload.preferredDate) {
    sections.push(
      "<tr><th align=\"left\">Preferred date</th><td>" +
        escapeHtml_(payload.preferredDateLabel || payload.preferredDate) +
        "</td></tr>",
    );
  }

  if (payload.preferredTime) {
    sections.push(
      "<tr><th align=\"left\">Preferred time</th><td>" +
        escapeHtml_(payload.preferredTime) +
        "</td></tr>",
    );
  }

  sections.push(
    "<tr><th align=\"left\">Received at</th><td>" +
      escapeHtml_(payload.receivedAt.toISOString()) +
      "</td></tr>",
  );
  sections.push("</table>");

  if (payload.message) {
    sections.push("<h3>Message</h3>");
    sections.push(
      "<p style=\"white-space:pre-wrap;\">" + escapeHtml_(payload.message) + "</p>",
    );
  }

  return sections.join("");
}

function createIframeResponse_(payload, targetOrigin) {
  const html =
    "<!DOCTYPE html><html><body><script>" +
    "(function(){var message=" +
    JSON.stringify({
      source: RESPONSE_SOURCE,
      ok: Boolean(payload.ok),
      requestId: payload.requestId || "",
      error: payload.error || "",
      ignored: Boolean(payload.ignored),
    }) +
    ";window.top.postMessage(message," +
    JSON.stringify(targetOrigin) +
    ");})();" +
    "</script></body></html>";

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function normalizeOrigin_(origin) {
  if (!origin) {
    return "*";
  }

  if (/^https:\/\/[A-Za-z0-9.-]+(?::\d+)?$/.test(origin)) {
    return origin;
  }

  return "*";
}

function cleanString_(value) {
  return value ? String(value).trim() : "";
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
