const express = require("express");
const { getCards, addCard, editCard, deleteCard, uploadFile } = require("../controllers/cardController.js");
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .get('/', getCards)
  .post('/', addCard)
  .put('/', editCard)
  .delete('/:_id', deleteCard)
  .post('/upload', express.raw(), uploadFile);

module.exports = router;
