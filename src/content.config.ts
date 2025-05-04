// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob } from "astro/loaders";

// 3. Define your collection(s)
const essaysCollection = defineCollection({
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
    sources: z.array(z.string()).optional().nullable(),
    // SEO enhancements
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
    seoImage: z.string().url().optional(),
  }),
});

const booksCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/books" }),
  schema: z.object({
    title: z.string(),
    author: z.array(z.string()),
    publisher: z.string().nullable(),
    publish: z.coerce.date(),
    isbn: z.string().nullable(),
    cover: z.string().url(),
    status: z.enum([
      "read",
      "Read",
      "Reading",
      "reading",
      "unread",
      "On hold",
      "Listening",
    ]),
    created: z.coerce.date(),
    "date-completed": z.coerce.date().optional().nullable(),
    topics: z.array(z.string()).optional().nullable(),
    aiAnalysis: z
      .array(
        z.object({
          title: z.string(),
          content: z.string(),
        })
      )
      .optional(),
    total: z.number().optional(),
    subtitle: z.string().optional(),
    category: z.array(z.string()).optional().nullable(),
    // SEO enhancements
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = {
  books: booksCollection,
  essays: essaysCollection,
};
