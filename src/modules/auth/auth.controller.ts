import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "./auth.service";

export const registerHandler = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json({
    status: "success",
    data: result,
  });
};

export const loginHandler = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const refreshHandler = async (req: Request, res: Response) => {
  const result = await refreshAccessToken(req.body);
  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const logoutHandler = async (req: Request, res: Response) => {
  await logoutUser(req.body);
  res.status(200).json({
    status: "success",
    message: "Logout muvaffaqiyatli",
  });
};

export const meHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.userId;
  const user = await getCurrentUser(userId);
  res.status(200).json({
    status: "success",
    data: user,
  });
};
