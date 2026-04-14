import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    categories: z.array(z.string()).optional(),
    image: z.string().nullable().optional(),
    description: z.string().optional(),
    layout: z.string().optional(),
  }),
});

export const collections = { posts };
