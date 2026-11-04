import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/o-que-e", destination: "/what-is-copero", permanent: true },
      { source: "/sobre-nos", destination: "/about-us", permanent: true },
      { source: "/prelecao/:slug", destination: "/match-preview/:slug", permanent: true },
      { source: "/apenas-no-celular", destination: "/mobile-only", permanent: true },
    ];
  },
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withSentryConfig(nextConfig);
