jest.mock('../clients/geminiClient');

const geminiClient = require('../clients/geminiClient');
const { analyzeComments } = require('../services/aiService');

const mockText = jest.fn();
const mockGenerateContent = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  geminiClient.getGenerativeModel = jest.fn().mockReturnValue({
    generateContent: mockGenerateContent,
  });
  mockGenerateContent.mockResolvedValue({ response: { text: mockText } });
});

describe('analyzeComments', () => {
  it('returns parsed summary and sentiment from clean JSON', async () => {
    mockText.mockReturnValue('{"summary":"todo bien","sentiment":"positive"}');
    const result = await analyzeComments(['comentario 1', 'comentario 2']);
    expect(result).toEqual({ summary: 'todo bien', sentiment: 'positive' });
  });

  it('strips markdown code fences if LLM wraps response in them', async () => {
    mockText.mockReturnValue('```json\n{"summary":"ok","sentiment":"neutral"}\n```');
    const result = await analyzeComments(['comentario']);
    expect(result).toEqual({ summary: 'ok', sentiment: 'neutral' });
  });

  it('calls getGenerativeModel with correct model name', async () => {
    mockText.mockReturnValue('{"summary":"x","sentiment":"negative"}');
    await analyzeComments(['c']);
    expect(geminiClient.getGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-2.5-flash' })
    );
  });

  it('throws when LLM returns invalid JSON', async () => {
    mockText.mockReturnValue('esto no es json');
    await expect(analyzeComments(['comentario'])).rejects.toThrow();
  });

  it('throws when generateContent rejects', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'));
    await expect(analyzeComments(['comentario'])).rejects.toThrow('API quota exceeded');
  });
});
