const anthropic = require('../clients/anthropicClient');

const SYSTEM_PROMPT = `Eres un analizador de comentarios.
Dado un listado de comentarios, devuelve ÚNICAMENTE un JSON con esta forma exacta (sin markdown, sin texto extra):
{"summary":"resumen breve en una oración","sentiment":"positive"}
Los valores válidos para sentiment son: positive, neutral, negative.`;

async function analyzeComments(comments) {
  const userMessage = comments.map((c, i) => `${i + 1}. ${c}`).join('\n');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const raw = message.content[0].text.trim();
  return JSON.parse(raw);
}

module.exports = { analyzeComments };
