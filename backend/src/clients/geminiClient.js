const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.LLM_API_KEY) {
  throw new Error('Missing required environment variable: LLM_API_KEY');
}

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);

module.exports = genAI;
