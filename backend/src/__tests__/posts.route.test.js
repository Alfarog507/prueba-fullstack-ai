jest.mock('../services/postsService');

const request = require('supertest');
const app = require('../index');
const { fetchGroupedPosts } = require('../services/postsService');

describe('GET /posts', () => {
  it('returns 200 with grouped posts array', async () => {
    fetchGroupedPosts.mockResolvedValue([
      { name: 'Alice', postCount: 5 },
      { name: 'Bob', postCount: 2 },
    ]);

    const res = await request(app).get('/posts');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { name: 'Alice', postCount: 5 },
      { name: 'Bob', postCount: 2 },
    ]);
  });

  it('returns 200 with empty array when no posts', async () => {
    fetchGroupedPosts.mockResolvedValue([]);
    const res = await request(app).get('/posts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 500 with error message when service fails', async () => {
    fetchGroupedPosts.mockRejectedValue(new Error('External API down'));
    const res = await request(app).get('/posts');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
