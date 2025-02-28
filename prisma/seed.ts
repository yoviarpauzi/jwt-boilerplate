import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      password: await bcrypt.hash("password", 10),
    },
    select: {
      email: true,
      name: true,
    },
  });
  console.log({ alice });
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
