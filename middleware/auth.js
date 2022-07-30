const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  var token = req.cookies.logged;
  if (!token) return res.status(403).send("token is required");

  try {
    var decoded = jwt.verify(token, process.env.secret);
    console.log(decoded);
    req.user = decoded;
  } catch (error) {
    if (error) return res.send(error);
  }
  return next();
};

module.exports = auth;
