const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

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
