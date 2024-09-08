const express = require("express");
const router = express.Router();
const db = require("../db/queries");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const user = req.user;

  const mainFolder = user
    ? await db.getUserMainFolder({ userId: req.user.id })
    : null;

  console.log(mainFolder);
  res.render("index", {
    title: "Express",
    user: user ? { username: user.username } : user,
    files: mainFolder ? mainFolder.files : mainFolder,
  });
});

module.exports = router;
