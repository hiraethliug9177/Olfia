import Link from "next/link";

const modes = [
  {
    eyebrow: "Capture",
    message: "That scent you loved? Save it for later",
    body: "Keep a useful detail from a real room: the product or method, the room, and one sentence worth remembering.",
    href: "/capture",
    cta: "Capture a scent scene",
  },
  {
    eyebrow: "Explore & Play",
    message: "Imagine a room, down to its scent",
    body: "Compose the atmosphere of a room you live in or one you imagine, from prepared elements, light, and scent.",
    href: "/rooms",
    cta: "Open Rooms",
  },
];

const steps = [
  { n: "1", title: "Start from a room", body: "A real one you want to remember, or one you want to imagine." },
  { n: "2", title: "Add scent, light, and objects", body: "Pick from prepared elements. Fragrance-free counts too." },
  { n: "3", title: "Keep it in your Scent Atlas", body: "Save, revisit, and export a Scene Card to share." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-[1120px] gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow">Olfia · a scent &amp; space project in progress</p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[2.75rem]">
            There&rsquo;s more to a room than what you see.
          </h1>
          <p className="mt-5 max-w-[60ch] text-xl text-ink-2">
            For the rooms you live in, and the ones you imagine.
          </p>
          <div className="ui mt-8 flex flex-wrap gap-3">
            <Link
              href="/rooms"
              className="rounded-control bg-interactive px-5 py-3 text-ivory no-underline transition-colors duration-[var(--duration-fast)] hover:bg-interactive-hover hover:text-ivory"
            >
              Open Rooms
            </Link>
            <Link
              href="/capture"
              className="rounded-control border border-interactive px-5 py-3 text-interactive no-underline transition-colors duration-[var(--duration-fast)] hover:bg-surface-2"
            >
              Capture a scent scene
            </Link>
          </div>
        </div>
        <div className="frame-signature afterimage relative aspect-[4/5] w-full max-w-[420px] justify-self-center rounded-stage lg:justify-self-end">
          <p className="absolute bottom-6 left-6 right-6 font-display text-lg text-charcoal">
            Same Room, Different Feelings
          </p>
        </div>
      </section>

      <section className="border-t border-hairline bg-surface-1">
        <div className="mx-auto grid max-w-[1120px] gap-6 px-4 py-12 sm:px-6 md:grid-cols-2">
          {modes.map((m) => (
            <article key={m.href} className="flex flex-col rounded-card border border-hairline bg-ivory p-6">
              <p className="eyebrow">{m.eyebrow}</p>
              <h2 className="mt-2 text-2xl">{m.message}</h2>
              <p className="mt-3 text-ink-2">{m.body}</p>
              <p className="ui mt-6">
                <Link href={m.href} className="no-underline hover:underline">
                  {m.cta} →
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow">How it works</p>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="font-display text-3xl text-periwinkle-deep" aria-hidden="true">
                {s.n}
              </span>
              <div>
                <h3 className="text-xl">{s.title}</h3>
                <p className="mt-1 text-ink-2">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="caption mt-10">
          Entries are saved in this browser only. Clearing site data removes them; export a Scene Card to keep a copy.
        </p>
      </section>
    </>
  );
}
