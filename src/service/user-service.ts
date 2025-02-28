import prisma from "../config/database";

const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });

  return user;
};

const getAll = () => {
  return prisma.user.findMany();
};

export default {
  getUser,
  getAll,
};
