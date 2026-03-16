const { z } = require('zod');

const aiResponseSchema = z.object({
  summary: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  categories: z.array(z.string()).default([]),
});

module.exports = { aiResponseSchema };
