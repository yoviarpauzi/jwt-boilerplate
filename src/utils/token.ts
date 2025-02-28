import jwt from "jsonwebtoken";
import prisma from "../config/database";

const generateToken = (email: string): string => {
  const token: string = jwt.sign(
    { email, created_at: Date.now() },
    process.env.JWT_SECRET_TOKEN!,
    {
      expiresIn: "1h",
      algorithm: "HS256",
    }
  );

  return token;
};

const generateRefreshToken = (email: string): string => {
  const refreshToken: string = jwt.sign(
    { email, create_at: Date.now() },
    process.env.JWT_SECRET_REFRESH_TOKEN!,
    {
      expiresIn: "1y",
      algorithm: "HS256",
    }
  );

  return refreshToken;
};

const isBlacklistToken = async (token: string): Promise<boolean> => {
  const isBlankListToken = await prisma.blackListToken.findUnique({
    where: {
      token,
    },
  });

  if (isBlankListToken) {
    return true;
  }

  return false;
};

const blockToken = async (token: Array<{ token: string }>): Promise<void> => {
  await prisma.blackListToken.createMany({
    data: token,
  });
};

export default {
  generateToken,
  generateRefreshToken,
  blockToken,
  isBlacklistToken,
};
