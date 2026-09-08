import test from "node:test";
import assert from "node:assert/strict";

function isNineAmInLondon(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
  return parts.hour === "09" && parts.minute === "00";
}

test("accepts 08:00 UTC during British Summer Time", () => {
  assert.equal(isNineAmInLondon(new Date("2026-09-08T08:00:00Z")), true);
  assert.equal(isNineAmInLondon(new Date("2026-09-08T09:00:00Z")), false);
});

test("accepts 09:00 UTC during Greenwich Mean Time", () => {
  assert.equal(isNineAmInLondon(new Date("2026-12-08T09:00:00Z")), true);
  assert.equal(isNineAmInLondon(new Date("2026-12-08T08:00:00Z")), false);
});
