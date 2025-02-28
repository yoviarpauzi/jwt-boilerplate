import { Request, Response, NextFunction } from "express";
import customError from "../error/custom-error";
import { JsonWebTokenError } from "jsonwebtoken";

const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof customError) {
    res.status(err.status).json({
      status: "error",
      message: err.message,
    });
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      status: "error",
      message: err.message,
    });
  } else if (err instanceof Error) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export default errorMiddleware;
