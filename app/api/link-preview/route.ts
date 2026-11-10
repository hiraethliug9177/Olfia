import { NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Reads a product page's own title and picture (Open Graph tags) so My shelf can turn a pasted link
 * into a product card (Tiffany 11/10). Nothing is stored. Only public http(s) pages are fetched:
 * private, local and link-local addresses are refused before every request and every redirect,
 * the read stops after 6 seconds and 600 KB, and only the page's <head> tags are returned.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 600_000;
const MAX_HOPS = 4;

function privateV4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19)) || a >= 224
  );
}

function privateIp(ip: string): boolean {
  if (isIP(ip) === 4) return privateV4(ip);
  const v = ip.toLowerCase();
  if (v === "::" || v === "::1") return true;
  if (v.startsWith("::ffff:")) return privateV4(v.slice(7));
  return v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb") || v.startsWith("ff");
}

async function safeHost(u: URL): Promise<boolean> {
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  if (u.username || u.password) return false;
  if (u.port && u.port !== "80" && u.port !== "443") return false;
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return false;
  if (isIP(host)) return !privateIp(host);
  try {
    const addrs = await lookup(host, { all: true });
    return addrs.length > 0 && addrs.every((a) => !privateIp(a.address));
  } catch {
    return false;
  }
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .trim();
}

function readMeta(html: string): Record<string, string> {
  const out: Record<string, string> = {};
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const attrs: Record<string, string> = {};
    for (const m of tag.matchAll(/([a-zA-Z:_-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) attrs[m[1].toLowerCase()] = m[3] ?? m[4] ?? "";
    const key = (attrs.property || attrs.name || "").toLowerCase();
    if (key && attrs.content && !out[key]) out[key] = decode(attrs.content);
  }
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title && !out["html:title"]) out["html:title"] = decode(title[1]);
  return out;
}

async function readHead(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    size += value.byteLength;
    const sofar = new TextDecoder().decode(value);
    if (size >= MAX_BYTES || /<\/head>/i.test(sofar)) break;
  }
  try { await reader.cancel(); } catch { /* already closed */ }
  const all = new Uint8Array(size);
  let o = 0;
  for (const c of chunks) { all.set(c, o); o += c.byteLength; }
  return new TextDecoder().decode(all);
}

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url") ?? "";
  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ ok: false, reason: "not a link" }, { status: 400 });
  }
  if (raw.length > 2000) return NextResponse.json({ ok: false, reason: "too long" }, { status: 400 });

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    for (let hop = 0; hop < MAX_HOPS; hop++) {
      if (!(await safeHost(target))) return NextResponse.json({ ok: false, reason: "address not allowed" }, { status: 400 });
      const res = await fetch(target, {
        redirect: "manual",
        signal: ctrl.signal,
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; OlfiaLinkPreview/1.0; +https://olfia-nine.vercel.app)",
          accept: "text/html,application/xhtml+xml",
          "accept-language": "en-US,en;q=0.8",
        },
      });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) break;
        target = new URL(loc, target);
        continue;
      }
      if (!res.ok || !(res.headers.get("content-type") ?? "").includes("html")) {
        return NextResponse.json({ ok: false, status: res.status }, { headers: { "cache-control": "s-maxage=600" } });
      }
      const meta = readMeta(await readHead(res));
      const pick = (...keys: string[]) => keys.map((k) => meta[k]).find((v) => v && v.length > 0);
      const img = pick("og:image:secure_url", "og:image", "twitter:image", "twitter:image:src");
      let image: string | undefined;
      if (img) {
        try {
          const iu = new URL(img, target);
          if (iu.protocol === "https:" || iu.protocol === "http:") image = iu.toString();
        } catch { /* ignore a broken image address */ }
      }
      return NextResponse.json(
        {
          ok: true,
          url: target.toString(),
          title: pick("og:title", "twitter:title", "html:title")?.slice(0, 160),
          siteName: pick("og:site_name", "application-name")?.slice(0, 60),
          description: pick("og:description", "description", "twitter:description")?.slice(0, 300),
          image,
        },
        { headers: { "cache-control": "s-maxage=86400, stale-while-revalidate=604800" } },
      );
    }
    return NextResponse.json({ ok: false, reason: "too many redirects" });
  } catch {
    return NextResponse.json({ ok: false, reason: "could not read the page" });
  } finally {
    clearTimeout(timer);
  }
}
