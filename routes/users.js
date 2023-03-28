const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const router = express.Router();

/* POST register a new user. */
router.post("/register", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  // Create a new user
  const user = new User({ username: username, password: password });

  // Generate a bearer token
  const token = jwt.sign({ sub: user._id }, "secret");
  user.token = token;

  // Save the user to the database
  user.save(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ token: token });
  });
});

module.exports = router;
