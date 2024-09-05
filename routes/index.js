const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const user = req.user;

  res.render("index", {
    title: "Express",
    user: user ? { username: user.username } : user,
  });
});

module.exports = router;
