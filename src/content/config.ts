import { z, defineCollection } from 'astro:content';

const practiceAreasCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
    }),
});

const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(), // SEO Description
        date: z.date(),
        author: z.string().default('Austin Core Legal'),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
    }),
});

export const collections = {
    'practice-areas': practiceAreasCollection,
    'blog': blogCollection,
};
