const { z } = require('zod');

const analyzeCommentsSchema = z.object({
  comments: z.array(z.string()).min(1),
});

module.exports = { analyzeCommentsSchema };
