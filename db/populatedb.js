const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const cascadeDelete = async () => {
  const users = await prisma.user.findMany();

  console.log("starting deletion...");

  for (const user of users) {
    console.log(`deleting user ${user.username}...`);

    const folders = await prisma.folder.findMany({
      where: {
        ownerId: user.id,
      },
    });

    const foldersId = folders.map((folder) => folder.id);

    const deleteFiles = prisma.file.deleteMany({
      where: {
        folderId: {
          in: foldersId,
        },
      },
    });

    const deleteFolders = prisma.folder.deleteMany({
      where: {
        ownerId: user.id,
      },
    });

    const deleteUser = prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    const transaction = await prisma.$transaction([
      deleteFiles,
      deleteFolders,
      deleteUser,
    ]);

    console.log("deletion completed");
  }
};

async function main() {
  console.log("seeding...");

  await cascadeDelete();

  const users = [
    {
      username: "aadheuss",
      password: "12345678",
    },
    {
      username: "sunflower",
      password: "12345678",
    },
  ];

  for (const user of users) {
    const { username, password } = user;
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error(err);
      }

      await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          folders: {
            create: {
              name: "main",
            },
          },
        },
      });
    });
  }

  console.log("done");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
