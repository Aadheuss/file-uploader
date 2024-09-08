const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.file_form_get = [
  (req, res) => {
    if (!req.user) {
      return res.redirect("/users/login");
    }

    res.render("file-form", { title: "Upload file" });
  },
];

exports.file_get = async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/users/login");
  }

  const { fileid } = req.params;
  console.log(fileid);

  const file = await db.getUserFileWithId({
    userId: req.user.id,
    fileId: fileid,
  });

  if (file === null) {
    return next();
  }

  res.render("file-details-page", {
    title: "File Information",
    file,
  });
};

exports.file_post = [
  upload.single("file"),
  async (req, res) => {
    let folderId = req.body.folderid;

    if (!folderId) {
      const folder = await db.getUserMainFolderId({ userId: req.user.id });
      folderId = folder.id;
    }

    const file = await db.createFile({
      name: req.file.originalname,
      data: req.file.buffer,
      mimetype: req.file.mimetype,
      size: req.file.size,
      folderId,
    });

    res.send("processed");
  },
];
