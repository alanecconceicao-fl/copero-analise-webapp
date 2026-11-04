// Pure carousel stepping (AC 3): auto-advance and swipe share the same
// wrap-around step — after the last item it goes back to the first.
export function nextIndex(current: number, length: number): number {
  return (current + 1) % length;
}

export function previousIndex(current: number, length: number): number {
  return (current - 1 + length) % length;
}

// Swipe: negative delta (finger moved left) advances; positive goes back.
// Small drags below the threshold are taps/noise, not swipes.
export const SWIPE_THRESHOLD_PX = 40;

export function indexAfterSwipe(
  current: number,
  length: number,
  deltaX: number,
): number {
  if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return current;
  return deltaX < 0 ? nextIndex(current, length) : previousIndex(current, length);
}
