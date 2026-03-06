import { z, defineCollection } from 'astro:content';

const practiceAreasCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
    }),
});

export const collections = {
    'practice-areas': practiceAreasCollection,
};
