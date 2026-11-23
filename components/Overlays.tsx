"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { SignupForm } from "@/components/SignupForm";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { setSignedIn, useOverlays } from "@/lib/mockAuth";

/**
 * The mock sign-in (v2, 11/23): Tiffany's reference layout (a split screen, the form on the left, a picture on the
 * right) in Olfia's own type, colours and corners. The picture is the footer's halftone image, cropped by the
 * browser from the original file, with one brand line and no testimonial (her answer 15). It hides below 1024px.
 * Any email and password "sign in"; nothing typed is kept or sent, and the form is cleared at once. Continue with
 * Google signs in the same way and loads nothing from Google. Shown only while the sample content is loaded
 * (lib/mockAuth.ts).
 */
function SignIn() {
  const after = useOverlays((s) => s.signIn);
  const close = useOverlays((s) => s.closeSignIn);
  const openPlus = useOverlays((s) => s.openPlus);
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => { if (after) { setMode("in"); setNote(null); } }, [after]);

  const finish = () => {
    const next = after;
    setSignedIn(true);
    close();
    if (next?.kind === "go") router.push(next.href);
    else if (next?.kind === "plus") openPlus(next.place);
  };
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    finish();
  };
  const signingIn = mode === "in";

  return (
    <Dialog open={!!after} onClose={close} label={signingIn ? "Sign in" : "Create an account"} className="dlg--full">
      <div className="auth">
        <div className="auth__side">
          <button type="button" className="dlg__x" aria-label="Close" onClick={close}><Icon name="x" /></button>
          <div className="auth__card">
            <span className="auth__mark" aria-hidden="true">Olfia</span>
            <h2 className="auth__title">{signingIn ? "Welcome back" : "Create your account"}</h2>
            {/* autocomplete off and the password-manager flags: a preview form should not offer to save a password */}
            <form key={mode} className="auth__form" onSubmit={submit} autoComplete="off">
              <label className="field auth__field">
                Email
                <input className="input" type="email" name="preview-email" required autoComplete="off" data-1p-ignore data-lpignore="true" data-autofocus />
              </label>
              <label className="field auth__field">
                Password
                <input className="input" type="password" name="preview-password" required autoComplete="off" data-1p-ignore data-lpignore="true" />
              </label>
              {signingIn ? (
                <div className="auth__row">
                  <label className="auth__check"><input type="checkbox" /> Remember me</label>
                  <button type="button" className="auth__link" onClick={() => setNote("Resetting a password comes with real accounts.")}>Forgot password?</button>
                </div>
              ) : null}
              <button type="submit" className="btn btn--primary btn--block">{signingIn ? "Sign in" : "Create account"}</button>
              <p className="auth__note" role="status">{note ?? "This is a preview: what you type here is not kept or sent."}</p>
            </form>
            <div className="auth__or" aria-hidden="true"><span>or</span></div>
            <button type="button" className="btn btn--ghost btn--block" onClick={finish}>Continue with Google</button>
            <p className="auth__switch">
              {signingIn ? "New to Olfia?" : "Already have an account?"}{" "}
              <button type="button" className="auth__link" onClick={() => { setMode(signingIn ? "up" : "in"); setNote(null); }}>
                {signingIn ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
        <div className="auth__art" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/footer/halftone.webp" alt="" width={1672} height={941} />
          <p className="auth__line">Life, through scent.</p>
        </div>
      </div>
    </Dialog>
  );
}

/** Join Olfia Plus: not open yet; the sign-up form keeps an email for the day it opens. */
function PlusNotOpen() {
  const place = useOverlays((s) => s.plus);
  const close = useOverlays((s) => s.closePlus);
  return (
    <Dialog open={place !== null} onClose={close} label="Olfia Plus" className="dlg--plus">
      <div className="dlg__body">
        <button type="button" className="dlg__x" aria-label="Close" onClick={close}><Icon name="x" /></button>
        <h2 className="dlg__title">Olfia Plus isn’t open yet.</h2>
        <p className="dlg__text">Leave your email and you’ll hear first.</p>
        <SignupForm place="plans" heading={false} />
      </div>
    </Dialog>
  );
}

export function Overlays() {
  return (
    <>
      <SignIn />
      <PlusNotOpen />
    </>
  );
}
