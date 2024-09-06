const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("seeding...");

  await prisma.user.createMany({
    data: [
      { username: "Aadheuss", password: "12345678" },
      { username: "sunflower", password: "12345678" },
    ],
    skipDuplicates: true,
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
