const express = require("express");
const router = express.Router();
const db = require("../db/queries");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const user = req.user;

  res.render("index", {
    title: "Express",
    user: user ? { username: user.username } : user,
  });
});

module.exports = router;
