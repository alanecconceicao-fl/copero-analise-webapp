import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Carousel } from "./carousel";
import { autoAdvanceMs } from "./content";

const items = [
  { id: "a", kicker: "K1", title: "Um", text: "Texto um" },
  { id: "b", kicker: "K2", title: "Dois", text: "Texto dois" },
  { id: "c", kicker: "K3", title: "Três", text: "Texto três" },
];

function currentSlide() {
  const style = document.querySelector(".carousel-track")?.getAttribute("style") ?? "";
  const match = style.match(/translateX\(-(\d+)%\)/);
  return match ? Number(match[1]) / 100 : 0;
}

function swipeLeft() {
  const el = screen.getByTestId("carousel");
  fireEvent.touchStart(el, { touches: [{ clientX: 300, clientY: 200 }] });
  fireEvent.touchEnd(el, { changedTouches: [{ clientX: 120, clientY: 200 }] });
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("starts on the first item", () => {
  render(<Carousel items={items} />);
  expect(currentSlide()).toBe(0);
});

test("advances on its own after autoAdvanceMs", () => {
  render(<Carousel items={items} />);
  act(() => vi.advanceTimersByTime(autoAdvanceMs));
  expect(currentSlide()).toBe(1);
});

test("advances on a left swipe", () => {
  render(<Carousel items={items} />);
  swipeLeft();
  expect(currentSlide()).toBe(1);
});

test("wraps back to the first item after the last", () => {
  render(<Carousel items={items} />);
  swipeLeft();
  swipeLeft();
  expect(currentSlide()).toBe(2);
  swipeLeft();
  expect(currentSlide()).toBe(0);
});

test("a short drag below the swipe threshold does not advance", () => {
  render(<Carousel items={items} />);
  const el = screen.getByTestId("carousel");
  fireEvent.touchStart(el, { touches: [{ clientX: 300, clientY: 200 }] });
  fireEvent.touchEnd(el, { changedTouches: [{ clientX: 285, clientY: 200 }] });
  expect(currentSlide()).toBe(0);
});

test("ignores touch end without a start point", () => {
  render(<Carousel items={items} />);
  fireEvent.touchEnd(screen.getByTestId("carousel"), { changedTouches: [{ clientX: 120, clientY: 200 }] });
  expect(currentSlide()).toBe(0);
});
