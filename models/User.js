const WordFile = require("./Word");
const wordSchema = WordFile.wordSchema;

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  uname: String,
  pass: String,
  words: [wordSchema],
  lastView: Number,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
