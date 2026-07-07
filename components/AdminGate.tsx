"use client";

import { FormEvent, ReactNode, useState } from "react";

const ADMIN_PASSWORD = "901Johnsons";

export function AdminGate({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = new FormData(form).get("adminPassword");
    if (password === ADMIN_PASSWORD) {
      setAllowed(true);
      setMessage("");
      form.reset();
      return;
    }
    setMessage("That password did not work.");
  }

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <section className="page-section admin-lock">
      <div className="form-panel">
        <p className="eyebrow">Admin</p>
        <h1>Family manager access.</h1>
        <p className="lead">Enter the family admin password to upload designated site photos.</p>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Password
            <input name="adminPassword" type="password" autoComplete="current-password" required />
          </label>
          <button className="button" type="submit">
            Enter Admin
          </button>
          {message ? <p className="notice">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
