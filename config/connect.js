const mongoose = require("mongoose");
exports.connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/auth", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => {
      console.log(error);
    });
};
