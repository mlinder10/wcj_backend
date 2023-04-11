const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") require("dotenv").config();
mongoose.connect(process.env.DATABASE);
const db = mongoose.connection;
const User = require("../models/User");
const { Word } = require("../models/Word");

db.on("open", () => {
  console.log("connected to database");
  app.listen(PORT, () => console.log(`App running on port ${PORT}`));
});
db.on("error", () => console.error("error in db"));
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

//
//
// AUTH
//
//

// login
app.get("/auth", async (req, res) => {
  try {
    let { uname, pass } = req.query;
    let user = await User.findOne({ uname, pass });
    if (user !== null) return res.status(200).json(user);
    res.status(400).json("Incorrect Credentials");
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

// sign up
app.post("/auth", async (req, res) => {
  try {
    let { uname, pass } = req.body;
    let existing = await User.find({ uname });
    if (existing.length > 0) return res.status(403).json("existing");
    let newUser = await User.create({
      uname,
      pass,
      words: [],
      lastView: Date.now(),
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

// change user data (not words)
app.patch("/auth", async (req, res) => {
  try {
    let { _id, keys, vals } = req.body;
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
      }
    }
    let newUser = await User.findOne({ _id });
    res.status(202).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

// remove users
app.delete("/auth", async (req, res) => {
  try {
    let { _id } = req.query;
    let user = await User.findOne({ _id });
    for (let i = 0; i < user.words.length; i++) {
      await Word.findOneAndDelete({ _id: user.words[i]._id });
    }
    await User.findOneAndRemove({ _id });
    res.status(202).json("success");
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

//
//
// WORDS
//
//

// get all words and update user last view
app.get("/words", async (req, res) => {
  try {
    let { _id } = req.query;
    let user = await User.findOne({ _id });
    await User.updateOne({ _id }, { lastView: Date.now() });

    let words = await Word.find();
    let filteredWords = [];
    for (let i = 0; i < words.length; i++) {
      if (words[i].timeEntered > user.lastView && words[i].userID != _id)
        filteredWords.push(words[i]);
    }
    res.status(200).json(filteredWords);
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

// post a word
app.post("/words", async (req, res) => {
  let { _id, word, def } = await req.body;
  try {
    let user = await User.findOne({ _id });
    let newWord = await Word.create({
      word,
      def,
      userName: user.uname,
      userID: _id,
    });
    await User.updateOne({ _id }, { words: [...user.words, newWord] });
    let newUser = await User.findOne({ _id });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

app.patch("/words", async (req, res) => {
  res.send("success");
});

// delete a word
app.delete("/words", async (req, res) => {
  try {
    if (req.query?.type === "all") {
      await Word.deleteMany();
      return res.status(202).json("success");
    }

    let { userID, wordID } = req.query;
    let user = await User.findOne({ _id: userID });
    let newWords = user.words.filter((w) => w._id != wordID);
    await Word.deleteOne({ _id: wordID });
    await User.updateOne({ _id: userID }, { words: newWords });
    let newUser = await User.findOne({ _id: userID });
    res.status(202).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

module.exports = Router;
