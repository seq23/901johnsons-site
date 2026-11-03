"use client";

import { createContext, FormEvent, ReactNode, useContext, useState } from "react";

// No secret lives in the browser: the typed admin token is checked by the server
// (/api/admin/pending-uploads, constant-time, per-IP lockout) and then kept in
// memory for the admin forms on this page.
const AdminTokenContext = createContext("");

export function useAdminToken() {
  return useContext(AdminTokenContext);
}

export function AdminGate({ children }: { children: ReactNode }) {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const typed = String(new FormData(form).get("adminToken") || "");
    setBusy(true);
    setMessage("");
    const body = new FormData();
    body.set("token", typed);
    body.set("action", "list");
    const response = await fetch("/api/admin/pending-uploads", { method: "POST", body });
    setBusy(false);
    if (response.ok) {
      form.reset();
      setToken(typed);
      return;
    }
    const payload = await response.json().catch(() => ({}));
    setMessage(response.status === 429 ? payload.message || "Too many tries. Please wait 15 minutes." : "That token did not work.");
  }

  if (token) {
    return <AdminTokenContext.Provider value={token}>{children}</AdminTokenContext.Provider>;
  }

  return (
    <section className="page-section admin-lock">
      <div className="form-panel">
        <p className="eyebrow">Admin</p>
        <h1>Family manager access.</h1>
        <p className="lead">Enter the family admin token to review uploads and change site photos.</p>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Admin token
            <input name="adminToken" type="password" autoComplete="current-password" required />
          </label>
          <button className="button" type="submit" disabled={busy}>
            {busy ? "Checking..." : "Enter Admin"}
          </button>
          {message ? <p className="notice">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
