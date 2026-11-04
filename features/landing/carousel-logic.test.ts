import { expect, test } from "vitest";
import {
  indexAfterSwipe,
  nextIndex,
  previousIndex,
  SWIPE_THRESHOLD_PX,
} from "./carousel-logic";

test("advances one by one", () => {
  expect(nextIndex(0, 3)).toBe(1);
  expect(nextIndex(1, 3)).toBe(2);
});

test("wraps back to the first after the last (AC 3: dá a volta)", () => {
  expect(nextIndex(2, 3)).toBe(0);
});

test("going back from the first wraps to the last", () => {
  expect(previousIndex(0, 3)).toBe(2);
});

test("swiping left advances, swiping right goes back", () => {
  expect(indexAfterSwipe(0, 3, -80)).toBe(1);
  expect(indexAfterSwipe(1, 3, 80)).toBe(0);
});

test("small drags below the threshold do not move the carousel", () => {
  expect(indexAfterSwipe(1, 3, SWIPE_THRESHOLD_PX - 1)).toBe(1);
  expect(indexAfterSwipe(1, 3, -(SWIPE_THRESHOLD_PX - 1))).toBe(1);
});
