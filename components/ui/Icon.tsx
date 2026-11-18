"use client";

import {
  ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleUserRound, Clock, Copy, Download,
  Drama, ExternalLink, Flame, FlaskConical, FlipHorizontal2, Gift, House, Image, ImagePlus, Instagram, Layers, Link2, Mail, MapPin,
  Menu, Minus, Pause, PencilRuler, Pin, Play, Plus, Redo2, RotateCcw, RotateCw, Scroll, SendToBack, Share2, Trash2, Undo2, X,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons: Lucide (lucide-react) is the only icon library in this project (Tiffany, 2026-11-10).
 * Interface controls 20px, primary navigation 24px, stroke 1.5. Only the icons below are imported.
 * Icon-only buttons must carry their own aria-label; the svg is aria-hidden.
 */
const ICONS = {
  home: House,
  user: CircleUserRound,
  chevronDown: ChevronDown,
  imagePlus: ImagePlus,
  link: Link2,
  play: Play,
  pause: Pause,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  instagram: Instagram,
  bookOpen: BookOpen,
  mail: Mail,
  undo: Undo2,
  redo: Redo2,
  check: Check,
  x: X,
  share: Share2,
  download: Download,
  rotate: RotateCcw,
  rotateCw: RotateCw,
  flip: FlipHorizontal2,
  plus: Plus,
  minus: Minus,
  front: Layers,
  back: SendToBack,
  copy: Copy,
  trash: Trash2,
  external: ExternalLink,
  // the six story topics of The Olfia Edit (11/17), see components/edit/TopicTag.tsx
  drama: Drama,
  scroll: Scroll,
  flask: FlaskConical,
  pencilRuler: PencilRuler,
  mapPin: MapPin,
  flame: Flame,
  // Pinterest has no Lucide mark; the share row uses a pin (11/17)
  pin: Pin,
  // 11/18: time of day and season on the detailed product cards (Rooms)
  clock: Clock,
  calendar: CalendarDays,
  // 11/18: Gifts (gift card, saving, Scent Card)
  gift: Gift,
  bookmark: Bookmark,
  bookmarkCheck: BookmarkCheck,
  image: Image,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const C = ICONS[name];
  return <C className={`ico ${className ?? ""}`} size={size} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />;
}

/** Menu ↔ X: the two Lucide icons cross-fade and turn a quarter, 1× speed. */
export function MenuMorph({ open, size = 24 }: { open: boolean; size?: number }) {
  return (
    <span className="ico-morph" data-open={open} style={{ width: size, height: size }} aria-hidden="true">
      <Menu size={size} strokeWidth={1.5} absoluteStrokeWidth />
      <X size={size} strokeWidth={1.5} absoluteStrokeWidth />
    </span>
  );
}
