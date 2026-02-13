import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtUser = {
  userId: string;
  email: string;
};

export type AuthRequest = Request & {
  user: JwtUser;
};

export const requireAuth = (req: Request, _: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(createHttpError(401, "Token berilmagan"));
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (typeof decoded === "string" || !decoded.userId || !decoded.email) {
      next(createHttpError(401, "Token yaroqsiz"));
      return;
    }

    (req as AuthRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch {
    next(createHttpError(401, "Token yaroqsiz yoki muddati tugagan"));
  }
};
