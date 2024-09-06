const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

const isUserLoggedIn = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }

  next();
};

const userValidation = {
  username_signup: body("username", "Username must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 70 })
    .withMessage("Username must not exceed 70 characters")
    .isAlphanumeric()
    .withMessage("Username name must only contain letters and numbers")
    .escape()
    .custom(async (value, { req }) => {
      const usernameExist = await prisma.user.findUnique({
        where: { username: value },
      });

      if (usernameExist) {
        throw new Error("Username is already taken");
      }
    }),
  password: body("password", "Password must contain at least 8 characters")
    .trim()
    .isLength({ min: 8 })
    .escape(),
};

exports.user_signup_get = (req, res) => {
  res.render("signup-form", { title: "Signup page" });
};

exports.user_signup_post = [
  userValidation.username_signup,
  userValidation.password,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("signup-form", {
        title: "Signup page",
        username: req.body.username,
        password: req.body.password,
        errors: errors.array(),
      });
    }

    const user = await db.createUser({
      username: req.body.username,
      password: req.body.password,
    });

    res.redirect("/users/login");
  }),
];

exports.user_login_get = [
  isUserLoggedIn,
  (req, res) => {
    res.render("login-form", { title: "Login page" });
  },
];

exports.user_login_post = [
  isUserLoggedIn,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login",
  }),
];

exports.user_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
};
