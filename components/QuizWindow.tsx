"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import { loadQuiz, type QuizResult } from "@/lib/quiz";

/** × closes the window for good in this browser; the quiz stays reachable from Scentpedia. */
const CLOSED_KEY = "olfia.quizwindow.v1";
/** Before the quiz the window shows The Guardian, the character the quiz invite has shown since 11/9. */
const SAMPLE = "istj";

/**
 * 05 Find your scent personality (v2, Tiffany's Notion 11/23): a small window at the bottom right of every page,
 * in place of the quiz section that used to sit on Home. It fades in once the first screen has scrolled by, folds
 * into a circle (on phones from the start; by itself in Capture, Rooms and Scent Card, from About Olfia down, and over
 * the footer, where it would cover things), and × closes it. It stays off the quiz page. After the quiz it shows your
 * own character. In Rooms and Scent Card it rises above the studio's bar when the bar is at the foot of the screen, so
 * it never sits on Save (11/24 handoff).
 */
export function QuizWindow() {
  const path = usePathname() ?? "/";
  const [ready, setReady] = useState(false);
  const [closed, setClosed] = useState(false);
  const [shown, setShown] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [phone, setPhone] = useState(false);
  const [aside, setAside] = useState(false);
  // what the person chose: "open" lasts until the next page (so Capture and Rooms can fold it again), "mini" lasts the visit
  const [choice, setChoice] = useState<"open" | "mini" | null>(null);
  const [lift, setLift] = useState(0);
  const moved = useRef(false);
  const box = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      setClosed(window.localStorage.getItem(CLOSED_KEY) === "closed");
    } catch {
      // storage blocked: the window shows, and × hides it for this visit
    }
    setReady(true);
    const mq = window.matchMedia("(max-width: 640px)");
    const onMq = () => setPhone(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    setResult(loadQuiz());
    setChoice((c) => (c === "open" ? null : c));
  }, [path]);

  // the first time only: after the first screen has scrolled by, not the moment a page opens
  useEffect(() => {
    if (shown) return;
    const check = () => { if (window.scrollY > window.innerHeight * 0.7) setShown(true); };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [shown, path]);

  // folded from About Olfia down (Home), and wherever the footer is on screen, so it covers no links there
  useEffect(() => {
    const about = document.getElementById("about");
    const foot = document.querySelector<HTMLElement>(".ft__panel");
    let raf = 0;
    const read = () => {
      raf = 0;
      const h = window.innerHeight;
      const pastAbout = about ? about.getBoundingClientRect().top < h * 0.7 : false;
      const footOn = foot ? foot.getBoundingClientRect().top < h : false;
      setAside(pastAbout || footOn);
      // a studio's bar (Rooms, Scent Card) or the Rooms drawer pinned to the foot of the screen: sit just above it
      const low = [".ws__bar", ".desk__bar", ".ws__tray"].flatMap((sel) => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el || (sel === ".ws__tray" && getComputedStyle(el).position !== "sticky")) return [];
        const r = el.getBoundingClientRect();
        return r.bottom > h - 110 && r.top < h ? [r.top] : [];
      });
      setLift(low.length ? Math.max(0, Math.round(h - Math.min(...low) - 8)) : 0);
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    return () => {
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [path]);

  const busy = path.startsWith("/capture") || path.startsWith("/rooms") || path === "/card";
  const mini = choice ? choice === "mini" : phone || busy || aside;

  // after a fold or an unfold the person asked for, focus follows to the control that replaced the one they pressed
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    box.current?.querySelector<HTMLElement>(mini ? ".qw__mini" : ".qw__btn")?.focus();
  }, [mini]);

  if (!ready || closed || !shown || path === "/quiz") return null;

  const code = (result?.code ?? SAMPLE).toLowerCase();
  const pick = (c: "open" | "mini") => { moved.current = true; setChoice(c); };
  const close = () => {
    try { window.localStorage.setItem(CLOSED_KEY, "closed"); } catch { /* this visit only */ }
    setClosed(true);
    track("quiz_window", { action: "close" });
  };

  return (
    <aside ref={box} className="qw" aria-label="Scent personality quiz" style={lift ? { bottom: 20 + lift } : undefined}>
      {mini ? (
        <button type="button" className="qw__mini" aria-label={result ? `${result.archetype.name}: open` : "Find your scent personality"} onClick={() => pick("open")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/assets/archetypes/${code}.webp`} alt="" width={400} height={480} />
        </button>
      ) : (
        <div className="qw__card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="qw__who" src={`/assets/archetypes/${code}.webp`} alt="" width={400} height={480} />
          <div className="qw__body">
            <p className="qw__title">{result ? result.archetype.name : "Find your scent personality"}</p>
            <Link href="/quiz" className="btn btn--primary qw__btn" onClick={() => track("quiz_window", { action: result ? "result" : "start" })}>
              {result ? "See your result" : "Take the quiz"}
            </Link>
          </div>
          <div className="qw__tools">
            <button type="button" aria-label="Minimize quiz panel" onClick={() => pick("mini")}><Icon name="minus" size={20} /></button>
            <button type="button" aria-label="Close quiz panel" onClick={close}><Icon name="x" size={20} /></button>
          </div>
        </div>
      )}
    </aside>
  );
}
