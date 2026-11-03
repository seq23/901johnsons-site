"use client";

import { useEffect, useState } from "react";
import { useAdminToken } from "@/components/AdminGate";

type PendingItem = {
  id: string;
  submittedAt: string;
  submitterName: string;
  familyBranch: string;
  caption: string;
  galleryTarget: string;
  reunionYear: string;
  type: string;
  size: number;
};

function placeLabel(item: PendingItem) {
  if (item.galleryTarget === "reunion") return `${item.reunionYear} reunion gallery`;
  if (item.galleryTarget === "connections") return "Family connections page";
  return "Homepage carousel";
}

async function post(token: string, fields: Record<string, string>) {
  const body = new FormData();
  body.set("token", token);
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  return fetch("/api/admin/pending-uploads", { method: "POST", body });
}

export function AdminPendingUploads() {
  const token = useAdminToken();
  const [items, setItems] = useState<PendingItem[] | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");

  async function load() {
    setBusy("list");
    const response = await post(token, { action: "list" });
    const payload = await response.json();
    setBusy("");
    if (!response.ok) {
      setMessage(payload.message || "Could not load uploads.");
      return;
    }
    setItems(payload.items);
    setMessage(payload.items.length ? "" : "Nothing is waiting for review.");
  }

  useEffect(() => {
    if (token) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function preview(id: string) {
    setBusy(id);
    const response = await post(token, { action: "media", id });
    setBusy("");
    if (!response.ok) {
      setMessage("Could not open that file.");
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    setPreviews((current) => ({ ...current, [id]: url }));
  }

  async function decide(id: string, action: "approve" | "reject") {
    setBusy(id);
    const response = await post(token, { action, id });
    const payload = await response.json();
    setBusy("");
    setMessage(payload.message || "Done.");
    if (response.ok) setItems((current) => (current || []).filter((item) => item.id !== id));
  }

  return (
    <div className="form-grid">
      <button className="button" type="button" onClick={() => load()} disabled={busy === "list"}>
        {busy === "list" ? "Loading..." : "Refresh list"}
      </button>
      {message ? <p className="notice">{message}</p> : null}
      {(items || []).map((item) => (
        <article key={item.id} className="panel">
          <p>
            <strong>{item.submitterName || "Someone"}</strong> wants this on the <strong>{placeLabel(item)}</strong>
            {item.familyBranch ? ` (${item.familyBranch})` : ""}.
          </p>
          {item.caption ? <p>{item.caption}</p> : null}
          {previews[item.id] ? (
            item.type.startsWith("video/") ? (
              <video src={previews[item.id]} controls style={{ maxWidth: "100%" }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previews[item.id]} alt="Upload waiting for review" style={{ maxWidth: "100%" }} />
            )
          ) : (
            <button className="button" type="button" onClick={() => preview(item.id)} disabled={busy === item.id}>
              Look at it
            </button>
          )}
          <p>
            <button className="button" type="button" onClick={() => decide(item.id, "approve")} disabled={busy === item.id}>
              Approve and publish
            </button>{" "}
            <button className="button" type="button" onClick={() => decide(item.id, "reject")} disabled={busy === item.id}>
              Remove
            </button>
          </p>
        </article>
      ))}
    </div>
  );
}
