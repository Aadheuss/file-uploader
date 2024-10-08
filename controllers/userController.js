const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");

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
  username_login: body("username", "Username must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 70 })
    .withMessage("Username must not exceed 70 characters")
    .isAlphanumeric()
    .withMessage("Username name must only contain letters and numbers")
    .escape(),
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

    bcrypt.hash(
      req.body.password,
      10,
      asyncHandler(async (err, hashedPassword) => {
        if (err) {
          next(err);
        }

        const user = await db.createUser({
          username: req.body.username,
          password: hashedPassword,
        });

        res.redirect("/users/login");
      })
    );
  }),
];

exports.user_login_get = [
  isUserLoggedIn,
  (req, res) => {
    const messages = req.session.messages
      ? req.session.messages.map((msg) => {
          return { msg: msg };
        })
      : req.session.messages;

    if (req.session.messages) {
      delete req.session.messages;
    }

    if (messages) {
      return res.status(401).render("login-form", {
        title: "Login page",
        errors: messages,
      });
    }

    res.render("login-form", {
      title: "Login page",
      errors: messages,
    });
  },
];

exports.user_login_post = [
  isUserLoggedIn,
  userValidation.username_login,
  userValidation.password,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("login-form", {
        title: "Login page",
        username: req.body.username,
        password: req.body.password,
        errors: errors.array(),
      });
    }

    next();
  }),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login",
    failureMessage: true,
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
