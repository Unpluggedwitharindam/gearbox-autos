import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { listPublicCars } from "@/lib/cars.functions";
import { brandOf } from "@/lib/seo-areas";

const BASE_URL = "https://gearboxautos.in";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

const xmlEscape = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/buy", changefreq: "daily", priority: "0.9" },
          { path: "/inventory", changefreq: "daily", priority: "0.9" },
          { path: "/sell", changefreq: "weekly", priority: "0.9" },
          { path: "/used-cars-in-jamshedpur", changefreq: "daily", priority: "0.9" },
          { path: "/sell-car-jamshedpur", changefreq: "weekly", priority: "0.9" },
          { path: "/garage", changefreq: "weekly", priority: "0.8" },
          { path: "/how-it-works", changefreq: "monthly", priority: "0.6" },
          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
        ];

        try {
          const cars = await listPublicCars();
          const brands = new Set<string>();
          for (const car of cars) {
            const brand = brandOf(car.name);
            if (brand) brands.add(brand);
          }
          for (const brand of brands) {
            entries.push({
              path: `/used-cars-in-jamshedpur/${encodeURIComponent(brand)}`,
              changefreq: "weekly",
              priority: "0.8",
            });
          }
          for (const car of cars) {
            entries.push({
              path: `/car/${encodeURIComponent(car.slug)}`,
              changefreq: "weekly",
              priority: "0.8",
              lastmod: car.updated_at ? new Date(car.updated_at).toISOString() : undefined,
            });
          }
        } catch (error) {
          console.error("[sitemap] failed to load cars", error);
          return new Response("Unable to generate sitemap", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
          });
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            [
              `  <url>`,
              `    <loc>${xmlEscape(`${BASE_URL}${e.path}`)}</loc>`,
              e.lastmod ? `    <lastmod>${xmlEscape(e.lastmod)}</lastmod>` : null,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
