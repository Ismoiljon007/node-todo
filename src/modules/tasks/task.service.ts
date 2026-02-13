import createHttpError from "http-errors";
import { prisma } from "../../config/prisma";
import type { CreateTaskInput, UpdateTaskInput } from "./task.schema";

export const createTask = async (userId: string, input: CreateTaskInput) => {
  return prisma.task.create({
    data: {
      title: input.title,
      status: input.status ?? "TODO",
      userId,
    },
  });
};

export const listUserTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateTask = async (
  userId: string,
  taskId: string,
  input: UpdateTaskInput,
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { id: true },
  });

  if (!task) {
    throw createHttpError(404, "Task topilmadi");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: input,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { id: true },
  });

  if (!task) {
    throw createHttpError(404, "Task topilmadi");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};
