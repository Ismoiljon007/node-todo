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

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Joriy user tasklarini olish
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasklar ro'yxati
 */
taskRouter.get("/", listTasksHandler);

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Yangi task yaratish
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateInput'
 *     responses:
 *       201:
 *         description: Task yaratildi
 */
taskRouter.post("/", validateBody(createTaskSchema), createTaskHandler);

/**
 * @openapi
 * /api/tasks/{taskId}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Taskni yangilash
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateInput'
 *     responses:
 *       200:
 *         description: Task yangilandi
 */
taskRouter.patch(
  "/:taskId",
  validateParams(taskIdParamsSchema),
  validateBody(updateTaskSchema),
  updateTaskHandler,
);

/**
 * @openapi
 * /api/tasks/{taskId}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Taskni o'chirish
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Task o'chirildi
 */
taskRouter.delete(
  "/:taskId",
  validateParams(taskIdParamsSchema),
  deleteTaskHandler,
);
