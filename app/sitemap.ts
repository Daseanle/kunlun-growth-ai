import { MetadataRoute } from "next";
import { tutorialEntries } from "@/lib/tutorials";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kunlun-growth-ai.vercel.app";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/tutorials`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/works`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/challenges`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/submit`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const tutorialPages: MetadataRoute.Sitemap = tutorialEntries.map(
    ({ slug }) => ({
      url: `${base}/tutorials/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  return [...staticPages, ...tutorialPages];
}
