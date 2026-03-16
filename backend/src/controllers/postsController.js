const { fetchGroupedPosts } = require('../services/postsService');

async function getPosts(req, res) {
  try {
    const posts = await fetchGroupedPosts();
    res.json(posts);
  } catch (err) {
    console.error('[postsController]', err);
    res.status(500).json({ error: 'Error al obtener los posts de la API externa' });
  }
}

module.exports = { getPosts };
