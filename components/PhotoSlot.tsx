"use client";

import type { SitePhotoSlot } from "@/data/sitePhotos";
import { useEffect, useState } from "react";

export function PhotoSlot({ slot }: { slot: SitePhotoSlot }) {
  const [src, setSrc] = useState(slot.src);

  useEffect(() => {
    let alive = true;
    async function loadLiveSlot() {
      try {
        const response = await fetch(`/api/site-photo?slotId=${encodeURIComponent(slot.id)}`, {
          cache: "no-store"
        });
        if (!response.ok) return;
        const payload = await response.json();
        if (alive && payload.url) {
          setSrc(payload.url);
        }
      } catch {
        // Placeholder remains available until Cloudflare Functions and R2 are connected.
      }
    }
    loadLiveSlot();
    return () => {
      alive = false;
    };
  }, [slot.id]);

  return (
    <figure className="photo-slot">
      <img src={src} alt={slot.alt} />
      <figcaption>
        #{slot.number.toString().padStart(3, "0")} · {slot.title}
      </figcaption>
    </figure>
  );
}
