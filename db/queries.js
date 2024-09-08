const { PrismaClient } = require("@prisma/client");
const { use } = require("passport");
const prisma = new PrismaClient();

exports.createUser = async ({ username, password }) => {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });

  return user;
};

exports.getUserMainFolderId = async ({ userId }) => {
  const folder = await prisma.folder.findFirst({
    where: {
      AND: {
        name: "main",
        ownerId: userId,
      },
    },
    select: {
      id: true,
    },
  });

  return folder;
};

exports.createFile = async ({ name, data, folderId }) => {
  console.log({ name, data, folderId });
  const file = await prisma.file.create({
    data: {
      name: name,
      data: data,
      folderId: folderId,
    },
  });

  return file;
};
