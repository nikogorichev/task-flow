export type Priority = "low" | "medium" | "high";

export type TaskStatus = "active" | "done";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: number;
}

export type TaskByStatus<T extends TaskStatus> = T extends "done"
  ? { completedAt: number } & Task
  : Task;

export type TaskMap = Record<string, Task>;

export type TaskInput = Omit<Task, "id" | "createdAt" | "status">;
