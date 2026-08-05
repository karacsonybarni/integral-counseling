const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const staleSlot = "2030-01-10T09:00:00.000Z";
const freshSlot = "2030-01-10T10:00:00.000Z";
const cacheValues = new Map([
  ["calendar-availability-v1-current-version", JSON.stringify([staleSlot])],
]);
const scriptProperties = new Map([
  ["availabilityCacheVersion", "current-version"],
]);
const cache = {
  get(key) {
    return cacheValues.get(key) || null;
  },
  put(key, value) {
    cacheValues.set(key, value);
  },
  remove(key) {
    cacheValues.delete(key);
  },
};
const properties = {
  getProperty(key) {
    return scriptProperties.get(key) || null;
  },
  setProperty(key, value) {
    scriptProperties.set(key, value);
  },
};
let lockReleased = false;

const context = vm.createContext({
  CacheService: { getScriptCache: () => cache },
  LockService: {
    getScriptLock: () => ({
      waitLock() {},
      releaseLock() {
        lockReleased = true;
      },
    }),
  },
  PropertiesService: { getScriptProperties: () => properties },
  Utilities: { getUuid: () => "refreshed-version" },
  console,
});
const source = fs.readFileSync(path.join(__dirname, "Code.gs"), "utf8");
vm.runInContext(source, context, { filename: "Code.gs" });

let freshAvailabilityReads = 0;
context.getAvailableSlots_ = () => {
  freshAvailabilityReads += 1;
  return [freshSlot];
};

assert.throws(
  () => context.bookAppointment_({ slotStart: staleSlot }),
  (error) => error.errorCode === "SLOT_UNAVAILABLE",
);
assert.equal(lockReleased, true);
assert.equal(
  scriptProperties.get("availabilityCacheVersion"),
  "refreshed-version",
);
assert.equal(
  cacheValues.has("calendar-availability-v1-current-version"),
  false,
);

const reloadedSlots = context.getCachedAvailableSlots_();
assert.equal(JSON.stringify(reloadedSlots), JSON.stringify([freshSlot]));
assert.equal(freshAvailabilityReads, 2);

console.log("Apps Script stale-availability conflict test passed.");
