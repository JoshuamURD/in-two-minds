// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob } from "astro/loaders";

// 3. Define your collection(s)
const essays = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/essays" }),
  schema: z.object({
    title: z.string().default("Untitled"),
    tags: z.array(z.string()),
    persona: z.string().default("Anonymous"),
    date: z.coerce.date(),
    draft: z.boolean().default(true).optional(),
    status: z.string().default("WIP").optional().nullable(),
    topics: z.array(z.string()),
    related: z.array(z.string()).optional().nullable(),
    summary: z.string().nullable(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { essays };
