const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

process.env.TZ = "Europe/Budapest";

const source = fs.readFileSync(path.join(__dirname, "Code.gs"), "utf8");
const RealDate = Date;
const DEFAULT_NOW = "2030-01-09T08:00:00.000+01:00";

function createEvent({
  start,
  end,
  transparency = "OPAQUE",
  bookingRequestId = "",
}) {
  const tags = new Map();
  if (bookingRequestId) {
    tags.set("websiteBookingRequestId", bookingRequestId);
  }

  return {
    getStartTime: () => new RealDate(start),
    getEndTime: () => new RealDate(end),
    getTransparency: () => transparency,
    getTag: (key) => tags.get(key) || "",
    setTag(key, value) {
      tags.set(key, value);
      return this;
    },
  };
}

function createHarness({ now = DEFAULT_NOW, events = [] } = {}) {
  const cacheValues = new Map([
    [
      "calendar-availability-v1-current-version",
      JSON.stringify(["2030-01-10T08:00:00.000Z"]),
    ],
  ]);
  const scriptProperties = new Map([
    ["availabilityCacheVersion", "current-version"],
  ]);
  const getEventsCalls = [];
  const createdEvents = [];
  const lockWaits = [];
  let lockReleased = false;
  let emailCount = 0;

  function FakeDate(...args) {
    return args.length === 0 ? new RealDate(now) : new RealDate(...args);
  }
  FakeDate.now = () => new RealDate(now).getTime();
  FakeDate.parse = RealDate.parse;
  FakeDate.UTC = RealDate.UTC;
  FakeDate.prototype = RealDate.prototype;

  const calendar = {
    getEvents(start, end) {
      getEventsCalls.push([new RealDate(start), new RealDate(end)]);
      return events;
    },
    createEvent(title, start, end, options) {
      const event = createEvent({ start, end });
      createdEvents.push({ title, start, end, options, event });
      return event;
    },
  };
  const cache = {
    get: (key) => cacheValues.get(key) || null,
    put: (key, value) => cacheValues.set(key, value),
    remove: (key) => cacheValues.delete(key),
  };
  const properties = {
    getProperty: (key) => scriptProperties.get(key) || null,
    setProperty: (key, value) => scriptProperties.set(key, value),
  };
  const context = vm.createContext({
    CacheService: { getScriptCache: () => cache },
    CalendarApp: {
      EventTransparency: { TRANSPARENT: "TRANSPARENT" },
      getDefaultCalendar: () => calendar,
      getCalendarById: () => calendar,
    },
    ContentService: {
      MimeType: { JAVASCRIPT: "JAVASCRIPT", JSON: "JSON" },
      createTextOutput: (text) => ({
        text,
        setMimeType() {
          return this;
        },
      }),
    },
    Date: FakeDate,
    HtmlService: {
      XFrameOptionsMode: { ALLOWALL: "ALLOWALL" },
      createHtmlOutput: (html) => ({
        html,
        setXFrameOptionsMode() {
          return this;
        },
      }),
    },
    LockService: {
      getScriptLock: () => ({
        waitLock(milliseconds) {
          lockWaits.push(milliseconds);
        },
        releaseLock() {
          lockReleased = true;
        },
      }),
    },
    MailApp: {
      sendEmail() {
        emailCount += 1;
      },
    },
    PropertiesService: { getScriptProperties: () => properties },
    Utilities: { getUuid: () => "refreshed-version" },
    console,
  });
  vm.runInContext(source, context, { filename: "Code.gs" });

  return {
    context,
    cacheValues,
    scriptProperties,
    getEventsCalls,
    createdEvents,
    lockWaits,
    get lockReleased() {
      return lockReleased;
    },
    get emailCount() {
      return emailCount;
    },
  };
}

function createPayload(overrides = {}) {
  return {
    formType: "appointment",
    language: "en",
    name: "Test Visitor",
    email: "visitor@example.com",
    phone: "",
    meetingMode: "online",
    meetingModeLabel: "Online",
    bookingRequestId: "booking_20300109_abcdefghijklmnop",
    message: "",
    preferredContact: "",
    preferredContactLabel: "",
    preferredDate: "2030-01-10",
    preferredDateLabel: "Thursday, January 10, 2030",
    preferredTime: "9:00 AM",
    slotStart: "2030-01-10T08:00:00.000Z",
    startedAt: 1,
    website: "",
    ...overrides,
  };
}

{
  const { context } = createHarness();
  const eligible = (slot, now = DEFAULT_NOW) =>
    context.isRequestedSlotEligible_(new RealDate(slot), new RealDate(now));

  assert.equal(eligible("2030-01-10T08:00:00.000Z"), true);
  assert.equal(eligible("2030-01-10T19:00:00.000Z"), true);
  assert.equal(eligible("2030-01-10T07:30:00.000Z"), false);
  assert.equal(eligible("2030-01-10T19:30:00.000Z"), false);
  assert.equal(eligible("2030-01-10T08:15:00.000Z"), false);
  assert.equal(eligible("2030-01-10T08:00:01.000Z"), false);
  assert.equal(
    eligible(
      "2030-01-10T08:00:00.000Z",
      "2030-01-09T09:00:00.000+01:00",
    ),
    true,
  );
  assert.equal(
    eligible(
      "2030-01-10T08:00:00.000Z",
      "2030-01-09T09:00:00.001+01:00",
    ),
    false,
  );
  assert.equal(eligible("2030-03-10T19:00:00.000Z"), true);
  assert.equal(eligible("2030-03-11T08:00:00.000Z"), false);

  assert.doesNotThrow(() =>
    context.validatePayload_(createPayload({ bookingRequestId: "" })),
  );
  assert.throws(
    () => context.validatePayload_(createPayload({ bookingRequestId: "bad" })),
    /booking request ID is invalid/,
  );
}

{
  const transparentEvent = createEvent({
    start: "2030-01-10T08:15:00.000Z",
    end: "2030-01-10T08:45:00.000Z",
    transparency: "TRANSPARENT",
  });
  const harness = createHarness({ events: [transparentEvent] });
  harness.context.getAvailableSlots_ = () => {
    throw new Error("Booking validation must not scan the 60-day horizon.");
  };

  assert.equal(harness.context.bookAppointment_(createPayload()), true);
  assert.deepEqual(harness.lockWaits, [15000]);
  assert.equal(harness.lockReleased, true);
  assert.equal(harness.getEventsCalls.length, 1);
  assert.equal(
    harness.getEventsCalls[0][0].toISOString(),
    "2030-01-10T08:00:00.000Z",
  );
  assert.equal(
    harness.getEventsCalls[0][1].toISOString(),
    "2030-01-10T08:55:00.000Z",
  );
  assert.equal(harness.createdEvents.length, 1);
  assert.equal(
    harness.createdEvents[0].event.getTag("websiteBookingRequestId"),
    "booking_20300109_abcdefghijklmnop",
  );
  assert.equal(
    harness.scriptProperties.get("availabilityCacheVersion"),
    "refreshed-version",
  );
  assert.equal(
    harness.cacheValues.has("calendar-availability-v1-current-version"),
    false,
  );
}

{
  const busyEvent = createEvent({
    start: "2030-01-10T08:30:00.000Z",
    end: "2030-01-10T09:00:00.000Z",
  });
  const harness = createHarness({ events: [busyEvent] });

  assert.throws(
    () => harness.context.bookAppointment_(createPayload()),
    (error) => error.errorCode === "SLOT_UNAVAILABLE",
  );
  assert.equal(harness.createdEvents.length, 0);
  assert.equal(harness.lockReleased, true);
  assert.equal(
    harness.scriptProperties.get("availabilityCacheVersion"),
    "refreshed-version",
  );
}

{
  const requestId = "booking_20300109_abcdefghijklmnop";
  const existingBooking = createEvent({
    start: "2030-01-10T08:00:00.000Z",
    end: "2030-01-10T08:55:00.000Z",
    bookingRequestId: requestId,
  });
  const harness = createHarness({
    now: "2030-01-10T10:00:00.000+01:00",
    events: [existingBooking],
  });

  assert.equal(
    harness.context.bookAppointment_(
      createPayload({ bookingRequestId: requestId }),
    ),
    false,
  );
  assert.equal(harness.createdEvents.length, 0);
  assert.equal(harness.lockReleased, true);

  harness.context.doPost({
    parameter: {
      ...createPayload({ bookingRequestId: requestId }),
      requestId: "req_retry",
      origin: "http://localhost:5000",
    },
  });
  assert.equal(harness.emailCount, 0);
}

{
  const harness = createHarness();
  harness.context.getAvailableSlots_ = () => ["2030-01-10T09:00:00.000Z"];

  assert.throws(
    () =>
      harness.context.bookAppointment_(
        createPayload({ slotStart: "2030-01-10T08:15:00.000Z" }),
      ),
    (error) => error.errorCode === "SLOT_UNAVAILABLE",
  );

  const reloadedSlots = harness.context.getCachedAvailableSlots_();
  assert.equal(
    JSON.stringify(reloadedSlots),
    JSON.stringify(["2030-01-10T09:00:00.000Z"]),
  );
}

console.log("Apps Script booking reliability tests passed.");
