import { Request, Response } from "express";

const profile = (req: Request, res: Response) => {
  const user = req.body.user;

  res.status(200).json({
    status: "success",
    message: "success get user profile",
    data: {
      user,
    },
  });
};

export default {
  profile,
};
