const express = require("express");
const passport = require("passport");
const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("login", { title: "Login" });
});

router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

module.exports = router;
