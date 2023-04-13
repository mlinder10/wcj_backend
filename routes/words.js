const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { Word } = require("../models/Word");

// get all words and update user last view
router.get("/", async (req, res) => {
  try {
    let { _id } = req.query;
    let user = await User.findOne({ _id });
    await User.updateOne({ _id }, { lastView: Date.now() });

    let words = await Word.find();
    let filteredWords = [];
    for (let i = 0; i < words.length; i++) {
      if (
        words[i].timeEntered > user.lastView &&
        words[i].userID != _id &&
        !words[i].reposted
      )
        filteredWords.push(words[i]);
    }
    res.status(200).json(filteredWords);
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

// post a word
router.post("/", async (req, res) => {
  let { _id, word, def, reposted } = req.body;
  try {
    let user = await User.findOne({ _id });
    let newWord = await Word.create({
      word,
      def,
      userName: user.uname,
      userID: _id,
      reposted: reposted === true ? true : false,
    });
    await User.updateOne({ _id }, { words: [...user.words, newWord] });
    let newUser = await User.findOne({ _id });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

// handle repost count
router.patch("/", async (req, res) => {
  try {
    let { _id } = req.body;
    let word = await Word.findOne({ _id });
    await Word.updateOne({ _id }, { reposts: word.reposts + 1 });
    res.status(202).json("success");
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

// delete a word
router.delete("/", async (req, res) => {
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

module.exports = router;
