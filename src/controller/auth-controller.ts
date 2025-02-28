import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/database";
import token from "../utils/token";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import customError from "../error/custom-error";

const authenticate = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: { email: string; password: string } | null =
    await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        password: true,
      },
    });

  const isPasswordValid = await bcrypt.compare(password, user?.password!);

  if (!user || !isPasswordValid) {
    res.status(401).json({
      status: "error",
      message: "invalid credentials",
    });
  }

  const accessToken = token.generateToken(user?.email!);
  const refreshToken = token.generateRefreshToken(user?.email!);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 356 * 24 * 60 * 60 * 1000, // 1 year
  });

  res.status(200).json({
    status: "success",
    message: "user authenticated successfully",
    data: {
      token: accessToken,
    },
  });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken: string = req.headers.authorization?.split(" ")[2] ?? "";
  const refreshToken: string = req.cookies.refreshToken ?? "";

  res.clearCookie("refreshToken");

  if (refreshToken == "" || accessToken == "") {
    return next(new customError(401, "user is not logged in"));
  }

  const isBlacklistedAccessToken = await token.isBlacklistToken(accessToken);
  const isBlackListRefreshToken = await token.isBlacklistToken(refreshToken);

  if (isBlackListRefreshToken || isBlacklistedAccessToken) {
    return next(new customError(401, "token invalid"));
  }

  try {
    await token.blockToken([
      {
        token: accessToken,
      },
      {
        token: refreshToken,
      },
    ]);

    res.status(200).json({
      status: "success",
      message: "user logged out successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.split(" ")[2] ?? "";
  const refreshToken = req.cookies.refreshToken ?? "";

  if (accessToken == "" || refreshToken == "") {
    return next(new customError(401, "user is not logged in"));
  }

  const isBlackListToken = await token.isBlacklistToken(accessToken);

  const isBlackListRefreshToken = await token.isBlacklistToken(refreshToken);

  if (isBlackListToken || isBlackListRefreshToken) {
    return next(new customError(401, "token invalid"));
  }

  try {
    await token.blockToken([{ token: accessToken }]);

    const decode = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN!
    ) as JwtPayload;

    const { email } = decode;
    const newToken = token.generateToken(email);
    res.status(200).json({
      status: "success",
      message: "token refreshed successfully",
      data: {
        newToken,
      },
    });
  } catch (err: JsonWebTokenError | any) {
    return next(err);
  }
};

export default { authenticate, logout, refreshAccessToken };
