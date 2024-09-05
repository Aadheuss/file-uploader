const passport = require("passport");

const isUserLoggedIn = (req, res, next) => {
  if (req.session.passport.user) {
    return res.redirect("/");
  }

  next();
};

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
