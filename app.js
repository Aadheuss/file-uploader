require("dotenv").config();

const express = require("express");
const path = require("path");

const createError = require("http-errors");
const logger = require("morgan");

const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportConfig = require("./config/passportConfig");
passport.use(new LocalStrategy(passportConfig.strategy));
passport.serializeUser(passportConfig.serializeUser);
passport.deserializeUser(passportConfig.deserializeUserUser);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const filesRouter = require("./routes/files");
const folderRouter = require("./routes/folder");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", filesRouter);
app.use("/folder", folderRouter);

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
