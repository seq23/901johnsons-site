"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import type { CarouselItem } from "@/data/carousel";

export function MediaCarousel({ items }: { items: CarouselItem[] }) {
  const [index, setIndex] = useState(0);
  const [liveItems, setLiveItems] = useState<CarouselItem[]>(items);
  const active = liveItems[index] || liveItems[0];

  useEffect(() => {
    let alive = true;
    async function loadLiveItems() {
      try {
        const response = await fetch("/api/carousel-items", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        const uploaded = Array.isArray(payload.items) ? payload.items : [];
        if (alive && uploaded.length) {
          setLiveItems([...uploaded, ...items]);
          setIndex(0);
        }
      } catch {
        // Static placeholders remain available if Cloudflare Functions are not connected yet.
      }
    }
    loadLiveItems();
    return () => {
      alive = false;
    };
  }, [items]);

  const label = useMemo(() => `${index + 1} of ${liveItems.length}`, [index, liveItems.length]);

  if (!active) {
    return null;
  }

  return (
    <section className="carousel-shell" aria-label="Family photo and video carousel">
      {active.type === "video" ? (
        <video className="carousel-media" src={active.src} controls playsInline />
      ) : (
        <img className="carousel-media" src={active.src} alt={active.title} />
      )}
      <div className="carousel-caption">
        <div>
          <strong>{active.title}</strong>
          <p>{active.caption}</p>
        </div>
        <div className="button-row" style={{ marginTop: 0 }}>
          <button
            className="button secondary"
            type="button"
            onClick={() => setIndex((current) => (current === 0 ? liveItems.length - 1 : current - 1))}
          >
            Previous
          </button>
          <button
            className="button"
            type="button"
            onClick={() => setIndex((current) => (current + 1) % liveItems.length)}
          >
            Next
          </button>
          <span aria-live="polite">{label}</span>
        </div>
      </div>
    </section>
  );
}
