const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
  eng: {
    type: String
  },
  han: {
    type: String,
    validate: {
      validator: function(value) {
        // Chinese characters range in Unicode: \u4e00-\u9fff
        const chineseRegex = /(?:[A-Z]+[\p{Script=Hani}]*)|[\p{Script=Hani}]+/gu;
        return chineseRegex.test(value);
      },
      message: props => `${props.value} is not a valid Chinese string!`
    }
  },
  pinyin: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  done: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Card", cardSchema);