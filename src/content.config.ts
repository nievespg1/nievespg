import { defineCollection, z } from "astro:content";

// ── Blog Collection ──────────────────────────────────────────────────────
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

// ── Projects Collection ──────────────────────────────────────────────────
const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    technologies: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    website: z.string().url().optional(),
    paper: z.string().url().optional(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

// ── Resume Collection ────────────────────────────────────────────────────
const resume = defineCollection({
  type: "content",
  schema: z.object({
    section: z.enum([
      "education",
      "experience",
      "certifications",
      "awards",
      "skills",
      "projects",
      "training",
    ]),
    order: z.number().default(0),
    title: z.string(),
  }),
});

export const collections = { blog, projects, resume };