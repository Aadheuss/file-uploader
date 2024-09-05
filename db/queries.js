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
