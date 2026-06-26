const express = require('express');
const { chatWithAI, semanticSearch, imageSearch } = require('../controllers/aiController');
const upload = require('../middleware/multer');

const aiRouter = express.Router();

// AI Chatbot
aiRouter.post('/chat', chatWithAI);

// Semantic Search (text-based AI search)
aiRouter.post('/semantic-search', semanticSearch);

// Image Search (multimodal - upload image to find similar products)
aiRouter.post('/image-search', upload.single('image'), imageSearch);

module.exports = aiRouter;
