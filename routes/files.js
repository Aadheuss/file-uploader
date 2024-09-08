const express = require("express");
const router = express.Router();

const fileContreller = require("../controllers/fileController");

router.get("/upload", fileContreller.file_upload_get);

router.post("/upload", fileContreller.file_upload_post);

module.exports = router;
