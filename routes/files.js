const express = require("express");
const router = express.Router();

const fileContreller = require("../controllers/fileController");

router.get("/upload", fileContreller.file_form_get);

router.post("/file", fileContreller.file_post);

router.get("/file/:fileid", fileContreller.file_get);

router.post("/file/:fileid/download", fileContreller.file_download_post);

module.exports = router;
