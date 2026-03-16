require('dotenv').config();

const express = require('express');
const postsRouter = require('./routes/posts');
const aiRouter = require('./routes/ai');

const app = express();

app.use(express.json());

app.use('/posts', postsRouter);
app.use('/ai', aiRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[express]', err);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

module.exports = app;
