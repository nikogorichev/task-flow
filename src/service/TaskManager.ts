import type { Task, TaskInput } from "../types/Task";

export class TaskManager {
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

  clear(): void {
    this.tasks = [];
  }
}
