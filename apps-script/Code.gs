const RESPONSE_SOURCE = "integral-counseling-apps-script";
const RECIPIENT_EMAIL = "karacsony.barni@gmail.com";
const MIN_SUBMISSION_DELAY_MS = 3000;
const BOOKING_TIME_ZONE = "Europe/Budapest";
const BOOKING_CALENDAR_ID = "";
const BOOKING_DURATION_MINUTES = 55;
const SLOT_STEP_MINUTES = 30;
const BOOKING_HORIZON_DAYS = 60;
const MAX_AVAILABLE_DATES = 14;
const MIN_BOOKING_NOTICE_HOURS = 24;
const AVAILABILITY_CACHE_TTL_SECONDS = 60 * 60;
const AVAILABILITY_CACHE_KEY_PREFIX = "calendar-availability-v1-";
const AVAILABILITY_CACHE_VERSION_PROPERTY = "availabilityCacheVersion";
const BOOKING_WINDOWS = [
  { startHour: 9, startMinute: 0, lastStartHour: 20, lastStartMinute: 0 },
];

function doGet(e) {
  const params = (e && e.parameter) || {};

  if (cleanString_(params.action) === "availability") {
    const requestId = cleanString_(params.requestId);
    const callback = normalizeJsonpCallback_(cleanString_(params.callback));

    try {
      return createJsonpResponse_({
        ok: true,
        requestId: requestId,
        slots: getCachedAvailableSlots_(),
        timeZone: BOOKING_TIME_ZONE,
      }, callback);
    } catch (error) {
      console.error("Failed to load calendar availability", error);
      return createJsonpResponse_({
        ok: false,
        requestId: requestId,
        error: "Calendar availability could not be loaded.",
      }, callback);
    }
  }

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

    if (payload.formType === "appointment") {
      bookAppointment_(payload);
    }

    try {
      MailApp.sendEmail({
        to: RECIPIENT_EMAIL,
        subject: buildSubject_(payload),
        body: buildPlainTextBody_(payload),
        htmlBody: buildHtmlBody_(payload),
        replyTo: payload.email,
        name: "Integral Counseling Website",
      });
    } catch (emailError) {
      if (payload.formType !== "appointment") {
        throw emailError;
      }
      console.error("Appointment was booked, but notification email failed", emailError);
    }

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
      errorCode: error && error.errorCode ? error.errorCode : "",
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
    meetingMode: cleanString_(params.meetingMode),
    meetingModeLabel: cleanString_(params.meetingModeLabel),
    message: cleanString_(params.message),
    preferredContact: cleanString_(params.preferredContact),
    preferredContactLabel: cleanString_(params.preferredContactLabel),
    preferredDate: cleanString_(params.preferredDate),
    preferredDateLabel: cleanString_(params.preferredDateLabel),
    preferredTime: cleanString_(params.preferredTime),
    slotStart: cleanString_(params.slotStart),
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
    if (payload.meetingMode !== "in_person" && payload.meetingMode !== "online") {
      throw new Error("A valid meeting format is required.");
    }

    if (!payload.slotStart || isNaN(new Date(payload.slotStart).getTime())) {
      throw new Error("A valid calendar slot is required.");
    }
  }

  if (payload.formType === "contact" && !payload.message) {
    throw new Error("Message is required.");
  }
}

function buildSubject_(payload) {
  if (payload.formType === "appointment") {
    return "Website appointment booked by " + payload.name;
  }

  return "Website contact request from " + payload.name;
}

function buildPlainTextBody_(payload) {
  const lines = [
    "Website form submission",
    "",
    "Type: " + (payload.formType === "appointment" ? "Appointment booking" : "Contact message"),
    "Language: " + payload.language,
    "Name: " + payload.name,
    "Email: " + payload.email,
  ];

  if (payload.phone) {
    lines.push("Phone: " + payload.phone);
  }

  if (payload.meetingModeLabel) {
    lines.push("Meeting format: " + payload.meetingModeLabel);
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
    "<tr><th align=\"left\">Type</th><td>" + escapeHtml_(payload.formType === "appointment" ? "Appointment booking" : "Contact message") + "</td></tr>",
    "<tr><th align=\"left\">Language</th><td>" + escapeHtml_(payload.language) + "</td></tr>",
    "<tr><th align=\"left\">Name</th><td>" + escapeHtml_(payload.name) + "</td></tr>",
    "<tr><th align=\"left\">Email</th><td>" + escapeHtml_(payload.email) + "</td></tr>",
  ];

  if (payload.phone) {
    sections.push("<tr><th align=\"left\">Phone</th><td>" + escapeHtml_(payload.phone) + "</td></tr>");
  }

  if (payload.meetingModeLabel) {
    sections.push(
      "<tr><th align=\"left\">Meeting format</th><td>" +
        escapeHtml_(payload.meetingModeLabel) +
        "</td></tr>",
    );
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
      errorCode: payload.errorCode || "",
      ignored: Boolean(payload.ignored),
      slots: payload.slots || [],
      timeZone: payload.timeZone || "",
    }) +
    ";window.top.postMessage(message," +
    JSON.stringify(targetOrigin) +
    ");})();" +
    "</script></body></html>";

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function createJsonpResponse_(payload, callback) {
  const message = {
    source: RESPONSE_SOURCE,
    ok: Boolean(payload.ok),
    requestId: payload.requestId || "",
    error: payload.error || "",
    slots: payload.slots || [],
    timeZone: payload.timeZone || "",
  };

  return ContentService.createTextOutput(
    callback + "(" + JSON.stringify(message) + ");",
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function getCachedAvailableSlots_() {
  const cache = CacheService.getScriptCache();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const version = getAvailabilityCacheVersion_();
    const cacheKey = AVAILABILITY_CACHE_KEY_PREFIX + version;
    const cachedValue = cache.get(cacheKey);

    if (cachedValue) {
      try {
        const cachedSlots = JSON.parse(cachedValue);
        if (Array.isArray(cachedSlots)) {
          return cachedSlots;
        }
      } catch (error) {
        console.warn("Ignoring invalid cached calendar availability", error);
      }

      cache.remove(cacheKey);
    }

    const slots = getAvailableSlots_();

    if (getAvailabilityCacheVersion_() !== version) {
      continue;
    }

    cache.put(
      cacheKey,
      JSON.stringify(slots),
      AVAILABILITY_CACHE_TTL_SECONDS,
    );
    return slots;
  }

  return getAvailableSlots_();
}

function getAvailabilityCacheVersion_() {
  return (
    PropertiesService.getScriptProperties().getProperty(
      AVAILABILITY_CACHE_VERSION_PROPERTY,
    ) || "0"
  );
}

function invalidateAvailabilityCache_() {
  const properties = PropertiesService.getScriptProperties();
  const previousVersion =
    properties.getProperty(AVAILABILITY_CACHE_VERSION_PROPERTY) || "0";

  properties.setProperty(
    AVAILABILITY_CACHE_VERSION_PROPERTY,
    Utilities.getUuid(),
  );
  CacheService.getScriptCache().remove(
    AVAILABILITY_CACHE_KEY_PREFIX + previousVersion,
  );
}

function getAvailableSlots_() {
  const calendar = getBookingCalendar_();
  const now = new Date();
  const earliestStart = new Date(
    now.getTime() + MIN_BOOKING_NOTICE_HOURS * 60 * 60 * 1000,
  );
  const horizonEnd = new Date(now);
  horizonEnd.setDate(horizonEnd.getDate() + BOOKING_HORIZON_DAYS);
  horizonEnd.setHours(23, 59, 59, 999);
  const busyEvents = calendar.getEvents(earliestStart, horizonEnd);
  const slots = [];
  let availableDateCount = 0;
  const day = new Date(now);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() + 1);

  for (let dayOffset = 0; dayOffset < BOOKING_HORIZON_DAYS; dayOffset += 1) {
    let slotsAddedForDate = 0;

    BOOKING_WINDOWS.forEach(function (window) {
      const slotStart = new Date(day);
      slotStart.setHours(window.startHour, window.startMinute, 0, 0);
      const lastSlotStart = new Date(day);
      lastSlotStart.setHours(
        window.lastStartHour,
        window.lastStartMinute,
        0,
        0,
      );

      while (slotStart.getTime() <= lastSlotStart.getTime()) {
        const slotEnd = new Date(
          slotStart.getTime() + BOOKING_DURATION_MINUTES * 60 * 1000,
        );

        if (
          slotStart.getTime() >= earliestStart.getTime() &&
          !hasOverlappingEvent_(busyEvents, slotStart, slotEnd)
        ) {
          slots.push(slotStart.toISOString());
          slotsAddedForDate += 1;
        }

        slotStart.setMinutes(slotStart.getMinutes() + SLOT_STEP_MINUTES);
      }
    });

    if (slotsAddedForDate > 0) {
      availableDateCount += 1;
      if (availableDateCount >= MAX_AVAILABLE_DATES) {
        break;
      }
    }

    day.setDate(day.getDate() + 1);
  }

  return slots;
}

function bookAppointment_(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const slotStart = new Date(payload.slotStart);
    const availableSlots = getAvailableSlots_();
    const requestedTimestamp = slotStart.getTime();
    const isAvailable = availableSlots.some(function (slot) {
      return new Date(slot).getTime() === requestedTimestamp;
    });

    if (!isAvailable) {
      invalidateAvailabilityCache_();
      throw createCodedError_(
        "SLOT_UNAVAILABLE",
        "That appointment is no longer available.",
      );
    }

    const slotEnd = new Date(
      slotStart.getTime() + BOOKING_DURATION_MINUTES * 60 * 1000,
    );
    const calendar = getBookingCalendar_();
    const title =
      (payload.language === "en" ? "First session – " : "Első alkalom – ") +
      payload.name;

    calendar.createEvent(title, slotStart, slotEnd, {
      description: buildCalendarDescription_(payload),
      guests: payload.email,
      sendInvites: true,
    });
    invalidateAvailabilityCache_();
  } finally {
    lock.releaseLock();
  }
}

function getBookingCalendar_() {
  const calendar = BOOKING_CALENDAR_ID
    ? CalendarApp.getCalendarById(BOOKING_CALENDAR_ID)
    : CalendarApp.getDefaultCalendar();

  if (!calendar) {
    throw new Error("Booking calendar is not available.");
  }

  return calendar;
}

function hasOverlappingEvent_(events, slotStart, slotEnd) {
  return events.some(function (event) {
    if (
      event.getTransparency() === CalendarApp.EventTransparency.TRANSPARENT
    ) {
      return false;
    }

    return (
      event.getStartTime().getTime() < slotEnd.getTime() &&
      event.getEndTime().getTime() > slotStart.getTime()
    );
  });
}

function buildCalendarDescription_(payload) {
  const lines = [
    "Website appointment booking",
    "Name: " + payload.name,
    "Email: " + payload.email,
  ];

  if (payload.phone) {
    lines.push("Phone: " + payload.phone);
  }

  if (payload.meetingModeLabel) {
    lines.push("Meeting format: " + payload.meetingModeLabel);
  }

  if (payload.message) {
    lines.push("", "Message:", payload.message);
  }

  return lines.join("\n");
}

function createCodedError_(code, message) {
  const error = new Error(message);
  error.errorCode = code;
  return error;
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

function normalizeJsonpCallback_(callback) {
  if (/^integralCalendarAvailability_[A-Za-z0-9_]+$/.test(callback)) {
    return callback;
  }

  throw new Error("Invalid availability callback.");
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
