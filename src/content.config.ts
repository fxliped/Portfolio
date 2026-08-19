import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const work = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    /** Your actual role on it — reviewers look for ownership language. */
    role: z.string(),
    /** Where the work happened. Shown on the panel so context isn't a click away. */
    org: z.string(),
    period: z.string(),
    /** Lower sorts first on the index. */
    order: z.number(),
    featured: z.boolean().default(true),
    stack: z.array(z.string()),
    metrics: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .max(4)
      .default([]),
    /** One or two sentences, shown on the index card. */
    summary: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),

    /**
     * Figures, numbered in order on the page. Keys map to the DIAGRAMS table in
     * components/Diagram.astro; images in `images` below continue the numbering.
     */
    figures: z
      .array(
        z.object({
          diagram: z.enum([
            "pipeline",
            "agent-graph",
            "event-sourcing",
            "forecast",
            "benchmark",
            "eval-matrix",
          ]),
          caption: z.string(),
        }),
      )
      .default([]),

    /**
     * Real images dropped into public/. Paths are absolute from the site root
     * (e.g. "/work/bird-eval.png"); width/height are required so the browser
     * can reserve space and the page doesn't reflow as they load.
     */
    images: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          width: z.number(),
          height: z.number(),
          caption: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { work };
