import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  line: string;
};

export default function ComingSoon({ eyebrow, title, line }: Props) {
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-[68ch] text-ink-2">{line}</p>
      <p className="ui mt-8">
        <Link href="/" className="no-underline hover:underline">
          ← Back to the start
        </Link>
      </p>
    </section>
  );
}
