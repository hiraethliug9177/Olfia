"use client";

import { useState } from "react";
import { strings } from "@/lib/strings";
import { track } from "@/lib/analytics";

/** Email sign-up (Kit, via /api/subscribe). `place` says where on the site it sits, for analytics. */
export function SignupForm({ place }: { place: string }) {
  const s = strings.signup;
  const [email, setEmail] = useState("");
  const [found, setFound] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, found, website: trap }),
      });
      if (!res.ok) throw new Error("failed");
      track("email_signup", { place, ...(found ? { found } : {}) });
      setState("done");
    } catch {
      setState("failed");
    }
  };

  if (state === "done") return <p className="signup__note" role="status" style={{ margin: 0 }}>{s.done}</p>;

  return (
    <form className="signup" onSubmit={submit}>
      {s.heading ? <p className="signup__heading">{s.heading}</p> : null}
      <div className="signup__row">
        <input
          className="input"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn--primary" disabled={state === "sending"}>{s.button}</button>
      </div>
      <select className="input signup__found" value={found} onChange={(e) => setFound(e.target.value)} aria-label={s.found}>
        <option value="">{s.found}</option>
        {s.foundOptions.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="signup__trap" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" />
      <p className="signup__note">{state === "failed" ? s.failed : s.note}</p>
    </form>
  );
}
