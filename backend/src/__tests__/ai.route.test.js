jest.mock('../services/aiService');

const request = require('supertest');
const app = require('../index');
const { analyzeComments } = require('../services/aiService');

describe('POST /ai/analyze-comments', () => {
  it('returns 200 with analysis result', async () => {
    analyzeComments.mockResolvedValue({ summary: 'todo bien', sentiment: 'positive' });

    const res = await request(app)
      .post('/ai/analyze-comments')
      .send({ comments: ['great product', 'loved it'] });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ summary: 'todo bien', sentiment: 'positive' });
  });

  it('returns 400 when comments array is empty', async () => {
    const res = await request(app)
      .post('/ai/analyze-comments')
      .send({ comments: [] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when comments field is missing', async () => {
    const res = await request(app)
      .post('/ai/analyze-comments')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when comments contains non-strings', async () => {
    const res = await request(app)
      .post('/ai/analyze-comments')
      .send({ comments: [1, 2, 3] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 500 when AI service fails', async () => {
    analyzeComments.mockRejectedValue(new Error('LLM quota exceeded'));

    const res = await request(app)
      .post('/ai/analyze-comments')
      .send({ comments: ['comentario'] });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
