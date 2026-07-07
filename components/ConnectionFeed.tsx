"use client";

import { useEffect, useState } from "react";

type ConnectionItem = {
  id: string;
  type: "image" | "video";
  src: string;
  title: string;
  caption: string;
};

export function ConnectionFeed() {
  const [items, setItems] = useState<ConnectionItem[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/connection-items")
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((payload) => {
        if (active) setItems(payload.items || []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!items.length) {
    return (
      <article className="panel">
        <h3>Family wall</h3>
        <p>Photos, videos, recipes, care updates, and branch news uploaded for this page will appear here.</p>
      </article>
    );
  }

  return (
    <div className="connection-feed">
      {items.map((item) => (
        <article className="panel connection-card" key={item.id}>
          {item.type === "video" ? (
            <video controls src={item.src} />
          ) : (
            <img src={item.src} alt={item.caption || item.title} />
          )}
          <h3>{item.title}</h3>
          <p>{item.caption}</p>
        </article>
      ))}
    </div>
  );
}
