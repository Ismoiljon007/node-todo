import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import createHttpError from "http-errors";
import { Prisma } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/auth.routes";
import { taskRouter } from "./modules/tasks/task.routes";
import { swaggerSpec } from "./config/swagger";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.use((_, __, next) => {
  next(createHttpError(404, "Route topilmadi"));
});

app.use((error: unknown, _: express.Request, res: express.Response, __: express.NextFunction) => {
  if (error instanceof Error) {
    console.error(error);
  } else {
    console.error("Noma'lum xatolik:", error);
  }

  const err = createHttpError.isHttpError(error)
    ? error
    : error instanceof Prisma.PrismaClientInitializationError
      ? createHttpError(500, "Database bilan ulanishda xatolik")
      : error instanceof Prisma.PrismaClientKnownRequestError
        ? createHttpError(500, "Database so'rovida xatolik")
        : createHttpError(
            500,
            process.env.NODE_ENV === "production"
              ? "Serverda ichki xatolik"
              : error instanceof Error
                ? error.message
                : "Serverda ichki xatolik",
          );

  res.status(err.statusCode).json({
    status: "error",
    message: err.message,
  });
});
