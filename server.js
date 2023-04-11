const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") require("dotenv").config();
mongoose.connect(
  "mongodb+srv://mlinder:mlinder@wcj.tgvr9zi.mongodb.net/?retryWrites=true&w=majority"
);
const db = mongoose.connection;
const User = require("./models/User");
const { Word } = require("./models/Word");

db.on("open", () => {
  console.log("connected to database");
  app.listen(PORT, () => console.log(`App running on port ${PORT}`));
});
db.on("error", () => console.error("error in db"));
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const wordsRouter = require("./routes/words");
app.use("/words", wordsRouter);
