"use client";

import { create } from "zustand";

type Toast = { id: number; text: string; href?: string; linkText?: string };

type ToastState = {
  toast: Toast | null;
  show: (text: string, href?: string, linkText?: string) => void;
  hide: () => void;
};

let timer: ReturnType<typeof setTimeout> | undefined;

export const useToast = create<ToastState>((set) => ({
  toast: null,
  show: (text, href, linkText) => {
    if (timer) clearTimeout(timer);
    set({ toast: { id: Date.now(), text, href, linkText } });
    timer = setTimeout(() => set({ toast: null }), 4200);
  },
  hide: () => set({ toast: null }),
}));
