"use client";

import { useEffect, useState } from "react";
import { PhotoSlot } from "@/components/PhotoSlot";
import type { SitePhotoSlot } from "@/data/sitePhotos";

type UploadedGalleryItem = {
  id: string;
  type: "image" | "video";
  src: string;
  title: string;
  caption: string;
};

export function ReunionGallery({ year, slots }: { year: number; slots: SitePhotoSlot[] }) {
  const [uploadedItems, setUploadedItems] = useState<UploadedGalleryItem[]>([]);

  useEffect(() => {
    let alive = true;
    async function loadGallery() {
      try {
        const response = await fetch(`/api/reunion-gallery-items?year=${year}`, { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (alive && Array.isArray(payload.items)) {
          setUploadedItems(payload.items);
        }
      } catch {
        // Placeholder gallery remains available until Cloudflare Functions are connected.
      }
    }
    loadGallery();
    return () => {
      alive = false;
    };
  }, [year]);

  return (
    <div className="gallery">
      {uploadedItems.map((item) => (
        <figure className="photo-slot" key={item.id}>
          {item.type === "video" ? (
            <video src={item.src} controls playsInline />
          ) : (
            <img src={item.src} alt={item.title} />
          )}
          <figcaption>{item.caption}</figcaption>
        </figure>
      ))}
      {slots.map((slot) => (
        <PhotoSlot key={slot.id} slot={slot} />
      ))}
    </div>
  );
}
