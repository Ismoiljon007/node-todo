import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createTask,
  deleteTask,
  listUserTasks,
  updateTask,
} from "./task.service";

export const createTaskHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.userId;
  const task = await createTask(userId, req.body);
  res.status(201).json({
    status: "success",
    data: task,
  });
};

export const listTasksHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.userId;
  const tasks = await listUserTasks(userId);
  res.status(200).json({
    status: "success",
    data: tasks,
  });
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.userId;
  const taskId = String(req.params.taskId);
  const updatedTask = await updateTask(userId, taskId, req.body);
  res.status(200).json({
    status: "success",
    data: updatedTask,
  });
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user.userId;
  const taskId = String(req.params.taskId);
  await deleteTask(userId, taskId);
  res.status(204).send();
};
