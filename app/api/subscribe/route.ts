import { NextResponse } from "next/server";

/**
 * Email sign-up → Kit, through Kit's public form address (form "Olfia website sign-up", id 10196062).
 * No API key: this is the same address Kit's own embed posts to. Kit sends the confirmation email
 * (double opt-in), so nobody is added without clicking it.
 */
const KIT_FORM = "https://app.kit.com/forms/10196062/subscriptions";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: { email?: unknown; found?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  // honeypot: people never see this field, bots fill it
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email) || email.length > 254) return NextResponse.json({ ok: false }, { status: 400 });
  const found = typeof body.found === "string" ? body.found.slice(0, 40) : "";

  const form = new URLSearchParams({ email_address: email });
  if (found) form.set("fields[found]", found);
  try {
    const res = await fetch(KIT_FORM, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: form,
    });
    if (!res.ok) return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
