const { analyzeCommentsSchema } = require('../schemas/analyzeCommentsSchema');
const { analyzeComments: runAnalysis, streamAnalyzeComments: runStream } = require('../services/aiService');

async function analyzeComments(req, res) {
  const result = analyzeCommentsSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Body inválido. Se esperaba { comments: string[] }' });
  }

  try {
    const analysis = await runAnalysis(result.data.comments);
    res.json(analysis);
  } catch (err) {
    console.error('[aiController]', err);
    res.status(500).json({ error: 'Error al analizar los comentarios con IA' });
  }
}

async function streamAnalyzeComments(req, res) {
  const result = analyzeCommentsSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Body inválido. Se esperaba { comments: string[] }' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    for await (const event of runStream(result.data.comments)) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  } catch (err) {
    console.error('[aiController stream]', err);
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Error al analizar los comentarios' })}\n\n`);
  } finally {
    res.end();
  }
}

module.exports = { analyzeComments, streamAnalyzeComments };
