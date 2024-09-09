const express = require("express");
const router = express.Router();

const folderController = require("../controllers/folderController");

router.get("/my-drive", folderController.main_folder_get);

module.exports = router;
