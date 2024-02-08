const express = require("express");
const { getDictionaryItem, getFullDictionary, sendDictionaryItems } = require("../controllers/chineseDictionaryController");

const router = express.Router();

router.get("/all", getFullDictionary).get("/:searchStr", getDictionaryItem).post("/sendAll", sendDictionaryItems);

module.exports = router;