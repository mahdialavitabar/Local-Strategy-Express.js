const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const createError = require("http-errors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const welcomeRouter = require("./routes/welcome");

const User = require("./models/users");

const app = express();

// Set up LocalStrategy with Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    function (username, password, done) {
      User.findOne({ where: { username: username } }).then((theUser) => {
        if (!theUser) {
          return done(null, false, { message: "User does not exist" });
        }
        if (!theUser.validPass(password)) {
          return done(null, false, { message: "Password is not valid." });
        }
        return done(null, true);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (user, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hjs");

app.use(
  session({
    secret: "mahdialavitabar",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/welcome", welcomeRouter);

// protected route
app.get(
  "/protected",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    res.json({ message: "Protected content" });
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
