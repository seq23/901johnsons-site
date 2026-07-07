"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function CarouselUploadForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/carousel-upload", {
      method: "POST",
      body: new FormData(form)
    });
    const payload = await response.json();
    setState(response.ok ? "success" : "error");
    setMessage(payload.message || "Submission received.");
    if (response.ok) {
      form.reset();
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Your name
        <input name="submitterName" required placeholder="Name" />
      </label>
      <label>
        Family branch
        <input name="familyBranch" placeholder="Branch, parent, grandparent, or household" />
      </label>
      <label>
        Photo or video
        <input name="media" type="file" accept="image/*,video/*" required />
      </label>
      <label>
        Caption
        <textarea name="caption" placeholder="Who is in this? Where was it taken? What year?" />
      </label>
      <button className="button" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Uploading..." : "Upload to Carousel Queue"}
      </button>
      {message ? <p className="notice">{message}</p> : null}
    </form>
  );
}

export function FamilyAnnouncementForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/family-update", {
      method: "POST",
      body: new FormData(form)
    });
    const payload = await response.json();
    setState(response.ok ? "success" : "error");
    setMessage(payload.message || "Family update submitted.");
    if (response.ok) {
      form.reset();
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Update type
        <select name="updateType" required>
          <option value="birth">Birth announcement</option>
          <option value="death">Death announcement</option>
          <option value="marriage">Marriage announcement</option>
        </select>
      </label>
      <label>
        Primary person or couple
        <input name="primaryNames" required placeholder="Full name(s)" />
      </label>
      <label>
        Date
        <input name="eventDate" type="date" />
      </label>
      <label>
        Parents, spouse, or close relatives
        <input name="relatedNames" placeholder="Names and relationships" />
      </label>
      <label>
        Family branch
        <input name="familyBranch" placeholder="Branch, grandparent line, or household" />
      </label>
      <label>
        Submitted by
        <input name="submittedBy" required placeholder="Your name" />
      </label>
      <label>
        Contact email or phone
        <input name="contact" required placeholder="So data managers can verify details" />
      </label>
      <label>
        Notes for family data managers
        <textarea name="notes" placeholder="Anything that helps confirm or place this correctly." />
      </label>
      <button className="button" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting..." : "Submit Family Update"}
      </button>
      {message ? <p className="notice">{message}</p> : null}
    </form>
  );
}
