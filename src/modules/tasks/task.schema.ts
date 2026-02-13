import { z } from "zod";

const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task sarlavhasi bo'sh bo'lmasligi kerak"),
  status: taskStatusSchema.optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task sarlavhasi bo'sh bo'lmasligi kerak")
    .optional(),
  status: taskStatusSchema.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
