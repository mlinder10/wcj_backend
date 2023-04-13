const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { Word } = require("../models/Word");

// login
router.get("/", async (req, res) => {
  try {
    let { uname, pass } = req.query;
    let user = await User.findOne({ uname, pass });
    if (user !== null) return res.status(200).json(user);
    res.status(401).json("Incorrect Credentials");
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

// sign up
router.post("/", async (req, res) => {
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
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
});

// change user data (not words)
router.patch("/", async (req, res) => {
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
router.delete("/", async (req, res) => {
  try {
    if (req?.query?.type === "all") {
      await User.deleteMany();
      return res.status(200).json("success");
    }
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

module.exports = router;
