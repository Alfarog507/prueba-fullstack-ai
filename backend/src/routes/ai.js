const { Router } = require('express');
const { analyzeComments, streamAnalyzeComments } = require('../controllers/aiController');

const router = Router();

router.post('/analyze-comments', analyzeComments);
router.post('/analyze-comments/stream', streamAnalyzeComments);

module.exports = router;
