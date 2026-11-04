// AdSense slot, present from v0 (AC 8). The script only loads when the unit
// ids exist (env) — while AdSense serves nothing (approval pending, no fill,
// consent stuck) the slot shows the "Publicidade" placeholder instead of a
// blank area, keeping the layout whole (AC 9).
// The <ins> attributes must mirror how the unit was created in AdSense
// (in-feed, fluid, its layout key) — a mismatched format can misrender or
// not fill. Changing the unit type in AdSense means changing them here too.
"use client";

import { useEffect, useRef, useState } from "react";

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

export function AdSenseSlot() {
  const slotRef = useRef<HTMLModElement>(null);
  const [showFallback, setShowFallback] = useState(!client || !slot);

  useEffect(() => {
    if (!client || !slot) return;
    const ins = slotRef.current;
    const existing = document.getElementById("copero-adsense-loader");
    const requestAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Loader blocked (ad blocker, offline) — the empty slot is harmless.
      }
    };
    // AdSense writes its verdict in data-ad-status on the <ins>. Element
    // height says nothing: the script pre-sizes the slot (~390px) before —
    // and even without — serving an ad. Fall back on an explicit "unfilled"
    // (site not approved, no inventory) the moment it lands, or when no
    // "filled" verdict arrived by the timeout (consent pending, loader
    // blocked). Never leave the pre-sized blank area on screen.
    const observer = new MutationObserver(() => {
      if (ins?.getAttribute("data-ad-status") === "unfilled") {
        setShowFallback(true);
      }
    });
    if (ins) observer.observe(ins, { attributeFilter: ["data-ad-status"] });
    const fallbackTimer = window.setTimeout(() => {
      if (ins?.getAttribute("data-ad-status") !== "filled") {
        setShowFallback(true);
      }
    }, 5000);
    const stopWatching = () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
    if (existing) {
      requestAd();
      return stopWatching;
    }
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.id = "copero-adsense-loader";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.addEventListener("load", requestAd, { once: true });
    document.head.appendChild(script);
    return () => {
      stopWatching();
      script.removeEventListener("load", requestAd);
    };
  }, []);

  return (
    <div data-testid="adsense-slot" className="adsense-slot">
      {showFallback ? (
        <div className="ad-slot-placeholder" role="note">
          <span>Publicidade</span>
        </div>
      ) : (
          <ins
            ref={slotRef}
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-format="auto"
            data-full-width-responsive="true"
            data-ad-client={client}
            data-ad-slot={slot}
          />
      )}
    </div>
  );
}
