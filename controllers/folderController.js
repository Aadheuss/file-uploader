const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

exports.main_folder_get = [
  async (req, res) => {
    if (!req.user) {
      return res.redirect("/users/login");
    }

    const mainFolder = await db.getUserMainFolder({
      userId: req.user.id,
    });

    console.log(mainFolder);

    res.render("folder-page", {
      title: "Folder details",
      folder: mainFolder,
    });
  },
];

exports.subfolder_form_get = asyncHandler((req, res) => {
  if (!req.user) {
    return res.redirect("/users/login");
  }

  const { parentid } = req.params;

  res.render("folder-form", {
    title: "Upload file",
    parentid,
  });
});

exports.subfolder_post = [
  body("name", "Folder name must not be emoty")
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage("Folder name must only contain letters and numbers")
    .escape(),
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.redirect("/users/login");
    }

    const errors = validationResult(req);
    const { parentid } = req.params;

    if (!errors.isEmpty()) {
      return res.status(422).render("folder-form", {
        title: "Create subfolder",
        name: req.body.name,
        parentid,
        errors: errors.array(),
      });
    }

    const subfolder = await db.createSubfolder({
      userId: req.user.id,
      name: req.body.name,
      parentId: parentid,
    });

    console.log({ subfolder });

    res.redirect("/");
  }),
];
