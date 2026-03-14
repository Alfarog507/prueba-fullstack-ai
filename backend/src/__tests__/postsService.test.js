jest.mock('../clients/externalApi');

const { fetchComments } = require('../clients/externalApi');
const { fetchGroupedPosts } = require('../services/postsService');

describe('fetchGroupedPosts', () => {
  it('groups comments by name and sorts by count descending', async () => {
    fetchComments.mockResolvedValue([
      { name: 'Alice', body: 'c1' },
      { name: 'Bob', body: 'c2' },
      { name: 'Alice', body: 'c3' },
      { name: 'Charlie', body: 'c4' },
      { name: 'Bob', body: 'c5' },
      { name: 'Alice', body: 'c6' },
    ]);

    const result = await fetchGroupedPosts();

    expect(result).toEqual([
      { name: 'Alice', postCount: 3 },
      { name: 'Bob', postCount: 2 },
      { name: 'Charlie', postCount: 1 },
    ]);
  });

  it('returns empty array when API returns no comments', async () => {
    fetchComments.mockResolvedValue([]);
    const result = await fetchGroupedPosts();
    expect(result).toEqual([]);
  });

  it('handles a single comment correctly', async () => {
    fetchComments.mockResolvedValue([{ name: 'Solo', body: 'only one' }]);
    const result = await fetchGroupedPosts();
    expect(result).toEqual([{ name: 'Solo', postCount: 1 }]);
  });

  it('propagates error when external API fails', async () => {
    fetchComments.mockRejectedValue(new Error('Network error'));
    await expect(fetchGroupedPosts()).rejects.toThrow('Network error');
  });
});
