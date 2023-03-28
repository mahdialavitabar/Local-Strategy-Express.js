const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/users");

router.get("/", (req, res) => {
  res.render("signup");
});

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw createError.BadRequest("Please provide both username and password");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw createError.Conflict("Username already exists");
    }

    const user = new User({ username, password });
    await user.save();
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
