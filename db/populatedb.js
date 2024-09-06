const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  console.log("seeding...");

  await prisma.user.deleteMany();

  bcrypt.hash("12345678", 10, async (err, hashedPassword) => {
    if (err) {
      console.error(err);
    }

    await prisma.user.createMany({
      data: [
        { username: "Aadheuss", password: hashedPassword },
        { username: "sunflower", password: hashedPassword },
      ],
      skipDuplicates: true,
    });
  });

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
