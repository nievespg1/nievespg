import { defineCollection, z } from "astro:content";

// ── Shared AI Metadata Schema ────────────────────────────────────────────
const aiSchema = z.object({
  include: z.boolean().default(true),
  priority: z.enum(["high", "medium", "low"]).optional(),
  audiences: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  canonicalPath: z.string().optional(),
  summary: z.string().optional(),
});

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
    ai: aiSchema.optional(),
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
    draft: z.boolean().default(false),
    image: z.string().optional(),
    ai: aiSchema.optional(),
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
    draft: z.boolean().default(false),
    title: z.string(),
    ai: aiSchema.optional(),
  }),
});

export const collections = { blog, projects, resume };