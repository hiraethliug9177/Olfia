"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A modal window on the browser's own <dialog> (v2, 11/23): the page behind cannot be reached and keyboard focus
 * stays inside, Esc closes it, focus goes back to where it was, and a click outside the window closes it too.
 * The page under it does not scroll (globals.css). Children render only while it is open. Mark a field with
 * data-autofocus to start there.
 */
export function Dialog({ open, onClose, label, className, children }: {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // the browser focuses the first control; a field marked data-autofocus (the sign-in's email) goes first instead
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`dlg${className ? ` ${className}` : ""}`}
      aria-label={label}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {open ? children : null}
    </dialog>
  );
}
