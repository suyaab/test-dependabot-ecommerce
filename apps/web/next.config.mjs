import { createRequire } from "node:module";
import withBundleAnalyzer from "@next/bundle-analyzer";

const require = createRequire(import.meta.url);
const cacheHandler = require.resolve("./cache-handler.mjs");

const isCIBuild = process.env.CI === "true";
const isRedisUrlSet =
  process.env.REDIS_URL != null && process.env.REDIS_URL !== "";

const UK_PREFIX = "/uk";
const UK_COUNTRY_CODE = "GB";
const GEO_COUNTRY_HTTP_HEADER = "x-geo-country";

// only analyze bundle when environment variable is set
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
export default bundleAnalyzer({
  output: isCIBuild ? "standalone" : undefined,
  transpilePackages: ["@ecommerce/commerce", "@ecommerce/utils"],
  experimental: {
    instrumentationHook: isCIBuild ? true : undefined, // only use NewRelic for docker builds
    serverComponentsExternalPackages: ["newrelic"],

    optimizePackageImports: ["@ecommerce/commerce", "@ecommerce/utils"],
  },
  cacheHandler: isRedisUrlSet ? cacheHandler : undefined,
  cacheMaxMemorySize: isRedisUrlSet ? 0 : undefined, // disable default caching for non DEV environments
  generateBuildId: async () =>
    `web-${process.env.LINGO_ENV}-${process.env.GIT_SHA.slice(0, 10)}`,
  webpack: (config) => {
    if (config.target.includes("node")) {
      config.externals.push("sharp");
      config.externals.push("pino");
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.hellolingo.com",
      },
    ],
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
  async redirects() {
    const ukRedirects = [
      "/about-us",
      "/benefits",
      "/biosensor",
      "/blog",
      "/continuous-glucose-monitoring",
      "/doc",
      "/fb-privacy-policy",
      "/fb-uk-terms-of-use",
      "/harpers-bazaar",
      "/metabolism",
      "/nutrition",
      "/performance",
      "/run",
      "/science",
      "/weight-loss",
      "/womens-health",
      // Dynamic routes
      "/blog/:slug",
      "/guide/:slug",
      "/profile/:slug",
      "/topic/:slug",
    ].map((source) => ({
      source,
      destination: `${UK_PREFIX}${source}`,
      permanent: false,
    }));

    const ukRedirectsWithGeoLocation = [
      "/eula",
      "/privacy-notice",
      "/terms-of-sale",
      "/terms-of-use",
    ].map((source) => ({
      source,
      destination: `${UK_PREFIX}${source}`,
      permanent: false,
      has: [
        {
          type: "header",
          key: GEO_COUNTRY_HTTP_HEADER,
          value: UK_COUNTRY_CODE,
        },
      ],
    }));

    const usRedirects = [
      "/us/",
      "/us/about-lingo",
      "/us/lingo-experience",
      "/us/privacy-notice",
      "/us/social-media-terms-of-use",
      "/us/terms-of-use",
      "/us/the-science",
      // Dynamic routes
      "/us/unsubscribe/:slug",
    ].map((source) => ({
      source,
      destination: `${source.replace("/us/", "/")}`,
      permanent: true,
    }));

    return [...ukRedirects, ...ukRedirectsWithGeoLocation, ...usRedirects];
  },
});
