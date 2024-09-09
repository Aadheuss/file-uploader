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

    const { folderid } = req.params;

    res.render("file-form", { title: "Upload file", folderid });
  },
];

exports.file_get = asyncHandler(async (req, res, next) => {
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
});

exports.file_post = [
  upload.single("file"),
  asyncHandler(async (req, res) => {
    let { folderid } = req.params;

    if (!req.user) {
      return res.redirect("/users/login");
    }

    if (!folderid) {
      const folder = await db.getUserMainFolderId({ userId: req.user.id });
      folderid = folder.id;
    }

    const file = await db.createFile({
      name: req.file.originalname,
      data: req.file.buffer,
      mimetype: req.file.mimetype,
      size: req.file.size,
      folderId: folderid,
    });

    res.redirect(`/files/file/${file.id}`);
  }),
];

exports.file_download_post = asyncHandler(async (req, res, next) => {
  const { fileid } = req.params;

  if (!req.user) {
    return res.redirect("/users/login");
  }

  const file = await db.getUserFileWithId({
    userId: req.user.id,
    fileId: fileid,
  });

  if (file === null) {
    return next();
  }

  res
    .set({
      "Content-Type": file.mimetype,
      "Content-Length": file.size,
      "Content-Disposition": `attachment; filename=${file.name}`,
    })
    .send(file.data);
});
