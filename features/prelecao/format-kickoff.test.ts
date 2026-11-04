import { expect, test } from "vitest";
import { formatKickoff } from "./format-kickoff";

test("formats the date in the São Paulo time zone regardless of browser settings", () => {
  expect(formatKickoff("2026-08-09T00:30:00Z")).toBe("Saturday, August 8 at 9:30 PM");
});
