import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).optional().default([]),
    image: z.string().nullable().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { posts };
