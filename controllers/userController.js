const passport = require("passport");

const isUserLoggedIn = (req, res, next) => {
  if (req.user) {
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

exports.user_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
};
