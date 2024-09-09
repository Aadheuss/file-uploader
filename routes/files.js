const express = require("express");
const router = express.Router();

const fileContreller = require("../controllers/fileController");

router.get("/folder/:folderid/files/upload", fileContreller.file_form_get);

router.post("/folder/:folderid/files/file", fileContreller.file_post);

router.get("/files/file/:fileid", fileContreller.file_get);

router.post("/files/file/:fileid/download", fileContreller.file_download_post);

module.exports = router;
