const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/usermodel.js");
const parser = require("body-parser");
const validator = require("validator");
const cookieParser = require("cookie-parser");

const auth = require("./middleware/auth");
require("dotenv").config();
require("./config/connect.js").connect();

app.use(parser.json());
app.use(cookieParser());
app.use(
  parser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  try {
    var { name, password, email } = req.body;
    if (!email || !password || !name) {
      console.log("empty");
      res.render("error.ejs");
    }
    const exisingUser = await User.findOne({ email });
    if (exisingUser) {
      console.log("exists");
      res.render("error.ejs");
    }
    if (!validator.isEmail(email)) {
      console.log("invalid email");
      res.render("error.ejs");
    }
    var encrypted_pwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: encrypted_pwd,
    });

    const token = jwt.sign({ user_id: user._id, email }, process.env.secret, {
      expiresIn: "2h",
    });

    user.token = token;

    res.redirect("/login");
  } catch {
    (error) => {
      console.log(error);
    };
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/logger", async (req, res) => {
  var { email, password } = req.body;
  if (!email || !password) {
    console.log("empty email/password");
    res.render("error.ejs");
  }
  if (!validator.isEmail(email)) {
    conosle.log("invalid email");
    res.render("error.ejs");
  }
  const user = await User.findOne({ email });
  if (!user) {
    console.log("does not exist");
    res.render("error.ejs");
  }
  const correctPassword = await bcrypt.compare(password, user.password);
  const token = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.secret,
    { expiresIn: "2h" }
  );
  user.token = token;
  res.cookie("logged", token, { httpOnly: true, expire: 600000 });

  res.redirect("/dashboard");
});

app.get("/dashboard", auth, (req, res) => {
  if (!req.user) {
    res.send("not authorized");
  }

  res.send("working");
});

app.listen(3000, (error) => {
  if (error) console.log(error);
  else console.log("server listening");
});
