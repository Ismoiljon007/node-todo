import createHttpError from "http-errors";
import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

export const validateBody = (schema: z.ZodTypeAny) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      next(createHttpError(400, message || "Body validation xatoligi"));
      return;
    }

    req.body = result.data;
    next();
  };
};

export const validateParams = (schema: z.ZodTypeAny) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      next(createHttpError(400, message || "Params validation xatoligi"));
      return;
    }

    req.params = result.data as Request["params"];
    next();
  };
};
