const { analyzeCommentsSchema } = require('../schemas/analyzeCommentsSchema');
const { analyzeComments: runAnalysis } = require('../services/aiService');

async function analyzeComments(req, res) {
  const result = analyzeCommentsSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Body inválido. Se esperaba { comments: string[] }' });
  }

  try {
    const analysis = await runAnalysis(result.data.comments);
    res.json(analysis);
  } catch {
    res.status(500).json({ error: 'Error al analizar los comentarios con IA' });
  }
}

module.exports = { analyzeComments };
