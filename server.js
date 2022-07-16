const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models/usermodel.js");
require("dotenv").config();

require("./config/connect.js").connect();
app.use(express.json());
app.use("view engine", "ejs");
app.get("/", (req, res) => {
  res.send("<h1>Hello from backend</h1>");
});

app.post("/signup", async (req, res) => {
  try {
    var { name, password, email } = req.body;
    if (!email || !password || !name) {
      res.status(400).send("<h1>Enter all information</h1>");
    }
    const exisingUser = await userModel.findOne({ email });
    if (exisingUser) {
      res.status(400).send("<h1>User already exists</h1>");
    }
    var encrypted_pwd = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      password: encrypted_pwd,
      email: email.toLowerCase(),
    });

    var token = jwt.sign({ UID: user._id }, process.env.secret, {
      expireIn: "2h",
    });

    user.token = token;

    res.send(200).json(user);
  } catch {
    (error) => {
      console.log(error);
    };
  }
});

app.listen(3000, (error) => {
  if (error) console.log(error);
  else console.log("server listening");
});
