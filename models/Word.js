const mongoose = require("mongoose");
const wordSchema = new mongoose.Schema({
  word: String,
  def: String,
  userName: String,
  userID: String,
  reposted: Boolean,
  reposts: {
    default: 0,
    type: Number,
  },
  timeEntered: {
    type: Number,
    default: Date.now(),
  },
});

const Word = mongoose.model("Word", wordSchema);
module.exports = { Word, wordSchema };
