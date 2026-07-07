"use client";

import { sitePhotoSlots } from "@/data/sitePhotos";
import { FormEvent, useState } from "react";

export function AdminSitePhotoForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/site-photo-upload", {
      method: "POST",
      body: new FormData(form)
    });
    const payload = await response.json();
    setMessage(payload.message || "Upload processed.");
    setBusy(false);
    if (response.ok) {
      form.reset();
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Admin upload token
        <input name="token" required type="password" placeholder="ADMIN_UPLOAD_TOKEN" />
      </label>
      <label>
        Site photo slot
        <select name="slotId" required>
          {sitePhotoSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              #{slot.number.toString().padStart(3, "0")} - {slot.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Replacement photo
        <input name="photo" type="file" accept="image/*" required />
      </label>
      <label>
        Internal note
        <textarea name="note" placeholder="Example: updated homepage portrait from Aunt Linda, July 2026." />
      </label>
      <button className="button" type="submit" disabled={busy}>
        {busy ? "Uploading..." : "Upload Site Photo"}
      </button>
      {message ? <p className="notice">{message}</p> : null}
    </form>
  );
}
