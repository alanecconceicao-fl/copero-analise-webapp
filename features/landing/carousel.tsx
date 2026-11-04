"use client";

// Carousel (AC 3): exactly the items it receives, advances on its own AND on
// swipe, wraps back to the first after the last. Stepping is pure logic in
// carousel-logic.ts (unit-tested); this component only wires time and touch.
import { useEffect, useRef, useState } from "react";
import { autoAdvanceMs, type CarouselItem } from "./content";
import { indexAfterSwipe, nextIndex } from "./carousel-logic";

export function Carousel({ items }: { items: CarouselItem[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((index) => nextIndex(index, items.length)),
      autoAdvanceMs,
    );
    return () => clearInterval(timer);
  }, [items.length]);

  function onTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    setCurrent((index) => indexAfterSwipe(index, items.length, deltaX));
  }

  return (
    <section
      aria-roledescription="carrossel"
      data-testid="carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="carousel-item"
            data-testid="carousel-item"
            data-item-id={item.id}
          >
            <span className="kicker">{item.kicker}</span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            {item.link && <a href={item.link.href}>{item.link.label}</a>}
          </article>
        ))}
      </div>
      <div className="carousel-dots" aria-hidden="true">
        {items.map((item, index) => (
          <span key={item.id} className={index === current ? "dot active" : "dot"} />
        ))}
      </div>
    </section>
  );
}
