jest.mock('../clients/geminiClient', () => ({}));

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
  it('returns parsed summary, sentiment and categories from clean JSON', async () => {
    mockText.mockReturnValue('{"summary":"todo bien","sentiment":"positive","categories":["soporte"]}');
    const result = await analyzeComments(['comentario 1', 'comentario 2']);
    expect(result).toEqual({ summary: 'todo bien', sentiment: 'positive', categories: ['soporte'] });
  });

  it('defaults categories to [] when missing from LLM response', async () => {
    mockText.mockReturnValue('{"summary":"ok","sentiment":"neutral"}');
    const result = await analyzeComments(['comentario']);
    expect(result).toEqual({ summary: 'ok', sentiment: 'neutral', categories: [] });
  });

  it('calls getGenerativeModel with correct model name', async () => {
    mockText.mockReturnValue('{"summary":"x","sentiment":"negative","categories":[]}');
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
