const genAI = require('../clients/geminiClient');
const { aiResponseSchema } = require('../schemas/aiResponseSchema');

const SYSTEM_PROMPT = `Eres un analizador de comentarios.
Dado un listado de comentarios, devuelve ÚNICAMENTE un JSON con esta forma exacta (sin markdown, sin texto extra):
{"summary":"resumen breve en una oración","sentiment":"positive","categories":["categoría1","categoría2"]}
Los valores válidos para sentiment son: positive, neutral, negative.
Las categorías deben ser entre 1 y 4 etiquetas breves (1-2 palabras) que describan los temas principales.`;

function buildUserMessage(comments) {
  return comments.map((c, i) => `${i + 1}. ${c}`).join('\n');
}

function parseResponse(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('LLM response did not contain a JSON object');
  return aiResponseSchema.parse(JSON.parse(match[0]));
}

async function analyzeComments(comments) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(buildUserMessage(comments));
  return parseResponse(result.response.text());
}

module.exports = { analyzeComments };
