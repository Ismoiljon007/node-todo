import { Router } from "express";
import { validateBody } from "../../common/validation";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registerHandler,
} from "./auth.controller";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.schema";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), registerHandler);
authRouter.post("/login", validateBody(loginSchema), loginHandler);
authRouter.post("/refresh", validateBody(refreshTokenSchema), refreshHandler);
authRouter.post("/logout", validateBody(refreshTokenSchema), logoutHandler);
authRouter.get("/me", requireAuth, meHandler);
