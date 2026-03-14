const { Router } = require('express');
const { analyzeComments } = require('../controllers/aiController');

const router = Router();

router.post('/analyze-comments', analyzeComments);

module.exports = router;
