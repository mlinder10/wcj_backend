const mongoose = require("mongoose");
const wordSchema = new mongoose.Schema({
  word: String,
  def: String,
  userName: String,
  userID: String,
  originalPoster: String,
  usersReposted: {
    default: [],
    type: [String],
  },
  timeEntered: {
    type: Number,
    default: Date.now(),
  },
});

const Word = mongoose.model("Word", wordSchema);
module.exports = { Word, wordSchema };
