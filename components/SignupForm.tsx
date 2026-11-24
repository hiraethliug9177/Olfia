"use client";

import { useState } from "react";
import { strings } from "@/lib/strings";
import { track } from "@/lib/analytics";

/**
 * Email sign-up. Posts straight from the browser to Kit's public form address (form "Olfia website
 * sign-up", id 10196062), the same way Kit's own embed does; no API key. Kit answers HTTP 200 even when it
 * refuses an address, so success is read from the JSON `status`. The form is single opt-in: no
 * confirmation email (Tiffany 11/15). The "found us" answer goes to GA4 with email_signup.
 * The found-us menu sits in the same row as the email field and button (Tiffany 11/17).
 */
const KIT_FORM = "https://app.kit.com/forms/10196062/subscriptions";

/** `heading={false}` leaves out the two lines above the email box, where a window has its own title (Olfia Plus, 11/23). */
export function SignupForm({ place, heading = true }: { place: string; heading?: boolean }) {
  const s = strings.signup;
  const [email, setEmail] = useState("");
  const [found, setFound] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    if (trap) { setState("done"); return; } // people never see the trap field; bots fill it
    setState("sending");
    try {
      const res = await fetch(KIT_FORM, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email_address: email.trim() }),
      });
      const data = (await res.json().catch(() => null)) as { status?: string } | null;
      if (!res.ok || !data || data.status === "failed") throw new Error("refused");
      track("email_signup", { place, ...(found ? { found } : {}) });
      setState("done");
    } catch {
      setState("failed");
    }
  };

  if (state === "done") return <p className="signup__note" role="status" style={{ margin: 0 }}>{s.done}</p>;

  return (
    <form className="signup" onSubmit={submit}>
      {heading && (s.heading || s.body) ? (
        <div className="signup__top">
          {s.heading ? <p className="signup__heading">{s.heading}</p> : null}
          {s.body ? <p className="signup__body">{s.body}</p> : null}
        </div>
      ) : null}
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
        <select className="input signup__found" value={found} onChange={(e) => setFound(e.target.value)} aria-label={s.found}>
          <option value="">{s.found}</option>
          {s.foundOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="signup__trap" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" />
      <p className="signup__note">{state === "failed" ? s.failed : s.note}</p>
    </form>
  );
}
