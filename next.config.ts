import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // The site lives at www.olfia.studio since 11/15. The submitted address forwards there, path and query kept.
  // (olfia.studio and olfia.co forward at the domain level in Vercel.)
  async redirects() {
    return [
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
