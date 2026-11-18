import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // The site lives at www.olfia.studio since 11/15. The submitted address forwards there, path and query kept.
  // (olfia.studio and olfia.co forward at the domain level in Vercel.)
  async redirects() {
    return [
      // Picks was folded into Gifts on 11/17; old links land on the full list, their filters kept.
      { source: "/picks", destination: "/gifts#all", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "olfia-nine.vercel.app" }],
        destination: "https://www.olfia.studio/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
