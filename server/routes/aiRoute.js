const express = require("express");
const { processAiMessages, startScraper, endScraper, communicateWithChatbot } = require("../controllers/aiController");
const router = express.Router();

router.get('/').post('/', processAiMessages).get('/start', startScraper).get('/end', endScraper).post('/chat', communicateWithChatbot);

module.exports = router;
