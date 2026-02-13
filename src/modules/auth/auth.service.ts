import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt, { type SignOptions } from "jsonwebtoken";
import { createHash, randomUUID } from "crypto";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import type {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from "./auth.schema";

const ACCESS_TOKEN_CONFIG: SignOptions = {
  expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
};

const REFRESH_TOKEN_CONFIG: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
};

type PublicUser = { id: string; email: string; name: string | null };

type RefreshJwtPayload = jwt.JwtPayload & {
  userId: string;
  email: string;
  tokenId: string;
};

const toPublicUser = (user: { id: string; email: string; name: string | null }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const parseRefreshPayload = (refreshToken: string): RefreshJwtPayload => {
  const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  if (
    typeof decoded === "string" ||
    !decoded.userId ||
    !decoded.email ||
    !decoded.tokenId
  ) {
    throw createHttpError(401, "Refresh token yaroqsiz");
  }

  return decoded as RefreshJwtPayload;
};

const issueTokenPair = async (user: PublicUser) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    env.JWT_ACCESS_SECRET,
    ACCESS_TOKEN_CONFIG,
  );

  const tokenId = randomUUID();
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, tokenId },
    env.JWT_REFRESH_SECRET,
    REFRESH_TOKEN_CONFIG,
  );

  const decodedRefresh = jwt.decode(refreshToken);
  if (
    !decodedRefresh ||
    typeof decodedRefresh === "string" ||
    typeof decodedRefresh.exp !== "number"
  ) {
    throw createHttpError(500, "Refresh token yaratishda xatolik");
  }

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(decodedRefresh.exp * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw createHttpError(409, "Bu email allaqachon ro'yxatdan o'tgan");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: passwordHash,
      name: input.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  const tokens = await issueTokenPair(user);

  return {
    ...tokens,
    user: toPublicUser(user),
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
    },
  });

  if (!user) {
    throw createHttpError(401, "Email yoki parol noto'g'ri");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, "Email yoki parol noto'g'ri");
  }

  const tokens = await issueTokenPair(user);

  return {
    ...tokens,
    user: toPublicUser(user),
  };
};

export const refreshAccessToken = async (input: RefreshTokenInput) => {
  const payload = parseRefreshPayload(input.refreshToken);

  const storedRefreshToken = await prisma.refreshToken.findFirst({
    where: {
      id: payload.tokenId,
      userId: payload.userId,
      revokedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!storedRefreshToken) {
    throw createHttpError(401, "Refresh token topilmadi yoki bekor qilingan");
  }

  if (storedRefreshToken.expiresAt.getTime() <= Date.now()) {
    throw createHttpError(401, "Refresh token muddati tugagan");
  }

  const incomingHash = hashToken(input.refreshToken);
  if (incomingHash !== storedRefreshToken.tokenHash) {
    throw createHttpError(401, "Refresh token yaroqsiz");
  }

  await prisma.refreshToken.update({
    where: { id: storedRefreshToken.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await issueTokenPair(storedRefreshToken.user);

  return {
    ...tokens,
    user: toPublicUser(storedRefreshToken.user),
  };
};

export const logoutUser = async (input: RefreshTokenInput) => {
  let payload: RefreshJwtPayload;
  try {
    payload = parseRefreshPayload(input.refreshToken);
  } catch {
    return;
  }

  const incomingHash = hashToken(input.refreshToken);
  const refreshTokenRecord = await prisma.refreshToken.findFirst({
    where: {
      id: payload.tokenId,
      userId: payload.userId,
      tokenHash: incomingHash,
      revokedAt: null,
    },
    select: { id: true },
  });

  if (!refreshTokenRecord) {
    return;
  }

  await prisma.refreshToken.update({
    where: { id: refreshTokenRecord.id },
    data: { revokedAt: new Date() },
  });
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw createHttpError(404, "Foydalanuvchi topilmadi");
  }

  return toPublicUser(user);
};
