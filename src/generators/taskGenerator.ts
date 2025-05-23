import type { Task } from "../types/Task";

export function* taskStepper(tasks: Task[]): Generator<Task, void, unknown> {
  for (const task of tasks) {
    yield task;
  }
}
