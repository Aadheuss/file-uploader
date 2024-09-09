const express = require("express");
const router = express.Router();

const folderController = require("../controllers/folderController");

router.get("/my-drive", folderController.main_folder_get);

router.get("/:parentid/subfolder-form", folderController.subfolder_form_get);

router.post("/:parentid/subfolder", folderController.subfolder_post);

module.exports = router;
