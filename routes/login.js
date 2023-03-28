const express = require("express");
const router = express.Router();
const User = require("../models/users");

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("login", { title: "Login" });
});

router.post("/", async function (req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      console.error(`User ${username} not found`);
      return res.redirect("/login");
    }
    if (!password) {
      console.error(`Invalid password for user ${username}`);
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.redirect("/welcome");
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
