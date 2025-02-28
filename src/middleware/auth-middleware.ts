import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import userService from "../service/user-service";
import prisma from "../config/database";
import customError from "../error/custom-error";
import token from "../utils/token";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken: string = req.headers.authorization?.split(" ")[1] ?? "";
  const refreshToken: string = req.cookies.refreshToken ?? "";

  if (accessToken == "" || refreshToken == "") {
    return next(new customError(401, "user is not logged in"));
  }

  const isBlacklistedAccessToken = await token.isBlacklistToken(accessToken);
  const isBlackListRefreshToken = await token.isBlacklistToken(refreshToken);

  if (isBlackListRefreshToken || isBlacklistedAccessToken) {
    return next(new customError(401, "token invalid"));
  }

  try {
    const decode = jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN!);

    const { email } = decode as JwtPayload;
    const user = await userService.getUser(email);
    req.body.user = user;
    return next();
  } catch (err: JsonWebTokenError | any) {
    return next(err);
  }
};

export default authMiddleware;
