import { TaskManager } from "./service/TaskManager.ts";
import "./style.css";
import type { Task } from "./types/Task.ts";
import { taskStepper } from "./generators/taskGenerator";

const sorterWorker = new Worker(
  new URL("./workers/sorter.ts", import.meta.url),
  {
    type: "module",
  }
);

const taskForm = document.getElementById("task-form") as HTMLFormElement;
const taskTitle = document.getElementById("task-title") as HTMLInputElement;
const taskPriority = document.getElementById(
  "task-priority"
) as HTMLSelectElement;
const taskList = document.getElementById("task-list") as HTMLDivElement;

const manager = new TaskManager();
const taskElements = new WeakMap<HTMLElement, Task>();

function renderTasksSorted(tasks: Task[]) {
  sorterWorker.postMessage(tasks);
}

sorterWorker.onmessage = (e: MessageEvent<Task[]>) => {
  taskList.innerHTML = "";
  const generator = taskStepper(e.data);

  const next = () => {
    const result = generator.next();
    if (result.done) return;

    const task = result.value;
    const div = document.createElement("div");
    div.className = "task";
    div.textContent = `${task.title} [${task.priority}] - ${task.status}`;
    taskList.appendChild(div);

    taskElements.set(div, task);
    div.addEventListener("click", () => {
      manager.completeTask(task.id);
      renderTasksSorted(manager.getTasks());
    });

    next()
  };

  next();
};

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const priority = taskPriority.value as "low" | "medium" | "high";
  if (!title) return;
  manager.addTask({ title, priority });
  renderTasksSorted(manager.getTasks());
  taskForm.reset();
});

renderTasksSorted(manager.getTasks());
