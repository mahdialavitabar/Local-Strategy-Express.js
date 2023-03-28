const express = require("express");
const passport = require("passport");
const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("login", { title: "Login" });
});

/* POST login page. */
router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect to protected content
    res.redirect("/protected");
  }
);

module.exports = router;
