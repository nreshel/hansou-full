const mongoose = require("mongoose");

const dictionarySchema = mongoose.Schema({
  eng: {
    type: String
  },
  han: {
    type: String
  },
  pinyin: {
    type: String
  }
})


module.exports = mongoose.model("Dictionary", dictionarySchema);