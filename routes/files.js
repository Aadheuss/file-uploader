const express = require("express");
const router = express.Router();

const fileContreller = require("../controllers/fileController");

router.get("/file", fileContreller.file_get);

router.post("/file", fileContreller.file_post);

module.exports = router;
