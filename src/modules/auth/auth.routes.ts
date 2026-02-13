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

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yangi foydalanuvchi ro'yxatdan o'tkazish
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterInput'
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tdi
 */
authRouter.post("/register", validateBody(registerSchema), registerHandler);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login qilish
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginInput'
 *     responses:
 *       200:
 *         description: Login muvaffaqiyatli
 */
authRouter.post("/login", validateBody(loginSchema), loginHandler);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Access tokenni refresh qilish
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenInput'
 *     responses:
 *       200:
 *         description: Yangi access/refresh tokenlar
 */
authRouter.post("/refresh", validateBody(refreshTokenSchema), refreshHandler);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh tokenni revoke qilish
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenInput'
 *     responses:
 *       200:
 *         description: Logout muvaffaqiyatli
 */
authRouter.post("/logout", validateBody(refreshTokenSchema), logoutHandler);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Joriy user profilini olish
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User ma'lumotlari
 */
authRouter.get("/me", requireAuth, meHandler);
