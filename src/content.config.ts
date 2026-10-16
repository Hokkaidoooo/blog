import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { CATEGORIES, COVERS } from './lib/site.mjs';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(180),
    date: z.coerce.date(),
    category: z.enum(CATEGORIES.map((item) => item.id) as [string, ...string[]]),
    tags: z.array(z.string().trim().min(1)).min(1).max(5),
    cover: z.enum(COVERS.map((item) => item.id) as [string, ...string[]]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
