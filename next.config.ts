import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Keep optimized variants for five days as well. The upstream file rule below only
    // covers the raw file; browsers load images through /_next/image.
    minimumCacheTTL: 432000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
        search: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog/kv-caching",
        destination: "/blog/kv-cache-explained",
        permanent: true,
      },
      {
        source: "/blog/prefill-vs-decode",
        destination: "/blog/prefill-vs-decode-explained",
        permanent: true,
      },
      {
        source: "/blog/prompt-caching",
        destination: "/blog/prompt-caching-explained",
        permanent: true,
      },
      {
        source: "/blog/semantic-caching",
        destination: "/blog/semantic-caching-explained",
        permanent: true,
      },
      {
        source: "/blog/llm-model-routing-explained",
        destination: "/blog/llm-model-routing",
        permanent: true,
      },
      {
        source: "/blog/my-first-blog-post",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/my-second-blog-post",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "script-src 'self' 'unsafe-inline' https://*.posthog.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.github.com https://api.emailjs.com https://*.emailjs.com https://*.posthog.com",
      "worker-src 'self' blob:",
      "frame-src https://drive.google.com https://docs.google.com https://www.youtube-nocookie.com",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
      {
        // Illustration filenames are stable, so a long TTL can pin replaced artwork.
        // Five days bounds how long a corrected image stays stale in a returning browser.
        source: "/(.*)\\.(svg|jpg|jpeg|png|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=432000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
