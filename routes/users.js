const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/login", userController.user_login_get);

router.post("/login", userController.user_login_post);

module.exports = router;
