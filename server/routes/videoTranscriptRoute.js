const express = require("express");
const { checkUrl } = require("../middleware/urlValidationMiddleware");
const { transcribeVideo } = require("../controllers/videoTranscriptController");
const router = express.Router();

router
  .get("/")
  .post("/", checkUrl, transcribeVideo);

module.exports = router;