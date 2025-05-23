import type { Task, TaskInput } from "../types/Task";

export interface TaskManager {
  addTask(input: TaskInput): Task;
  getTasks(): Task[];
  completeTask(id: string): void;
  deleteTask(id: string): void;
  restoreTask(id: string): void;
}

export class TaskManagerImpl implements TaskManager {
  private tasks: Task[] = [];

  addTask(input: TaskInput): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      priority: input.priority,
      status: "active",
      createdAt: Date.now(),
    };
    this.tasks.push(task);
    return task;
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  completeTask(id: string): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) task.status = "done";
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  restoreTask(id: string): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) task.status = "active";
  }
}
