import { Router } from "express";
import { z } from "zod";
import { validateBody, validateParams } from "../../common/validation";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  createTaskHandler,
  deleteTaskHandler,
  listTasksHandler,
  updateTaskHandler,
} from "./task.controller";
import { createTaskSchema, updateTaskSchema } from "./task.schema";

const taskIdParamsSchema = z.object({
  taskId: z.string().uuid("taskId UUID formatda bo'lishi kerak"),
});

export const taskRouter = Router();

taskRouter.use(requireAuth);
taskRouter.get("/", listTasksHandler);
taskRouter.post("/", validateBody(createTaskSchema), createTaskHandler);
taskRouter.patch(
  "/:taskId",
  validateParams(taskIdParamsSchema),
  validateBody(updateTaskSchema),
  updateTaskHandler,
);
taskRouter.delete(
  "/:taskId",
  validateParams(taskIdParamsSchema),
  deleteTaskHandler,
);
