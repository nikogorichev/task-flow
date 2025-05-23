import { TaskManagerImpl } from "./service/TaskManager";
import "./style.css";
import type { Priority, Task } from "./types/Task";
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
const activeList = document.getElementById("active-list") as HTMLDivElement;
const doneList = document.getElementById("done-list") as HTMLDivElement;

const managerService = new TaskManagerImpl();
const taskElements = new WeakMap<HTMLElement, Task>();

const renderTasksByStatus = (tasks: Task[]) => {
  sorterWorker.postMessage(tasks);
};

const renderTask = (task: Task) => {
  const div = document.createElement("div");
  div.className = "task";
  div.textContent = `${task.title} [${task.priority}]`;

  const buttons = document.createElement("div");
  buttons.className = "task-buttons";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Удалить";
  deleteBtn.className = "delete";
  deleteBtn.onclick = () => {
    managerService.deleteTask(task.id);
    renderTasksByStatus(managerService.getTasks());
  };

  if (task.status === "active") {
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Завершить";
    completeBtn.onclick = () => {
      managerService.completeTask(task.id);
      renderTasksByStatus(managerService.getTasks());
    };
    buttons.append(completeBtn);
    activeList.appendChild(div);
  } else {
    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "Вернуть";
    restoreBtn.className = "restore";
    restoreBtn.onclick = () => {
      managerService.restoreTask(task.id);
      renderTasksByStatus(managerService.getTasks());
    };
    buttons.append(restoreBtn);
    doneList.appendChild(div);
  }

  buttons.append(deleteBtn);
  div.appendChild(buttons);
  taskElements.set(div, task);
};

sorterWorker.onmessage = (event: MessageEvent<Task[]>) => {
  activeList.innerHTML = "";
  doneList.innerHTML = "";
  const generator = taskStepper(event.data);

  const next = () => {
    const result = generator.next();
    if (result.done) {
      return;
    }

    renderTask(result.value);
    next();
  };

  next();
};

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const priority = taskPriority.value as Priority;
  if (!title) {
    return;
  }
  managerService.addTask({ title, priority });
  renderTasksByStatus(managerService.getTasks());
  taskForm.reset();
});

renderTasksByStatus(managerService.getTasks());
