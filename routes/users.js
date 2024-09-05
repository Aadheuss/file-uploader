const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/signup", userController.user_signup_get);

router.post("/signup", userController.user_signup_post);

router.get("/login", userController.user_login_get);

router.post("/login", userController.user_login_post);

router.get("/logout", userController.user_logout_get);

module.exports = router;
