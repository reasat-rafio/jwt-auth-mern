const jwt = require("jsonwebtoken");
const User = require("../models/authSchema");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "secret", (err, decodedToken) => {
      if (err) {
        console.log(err.massage);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  }
};
// ? check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "rafios secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.massage);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
