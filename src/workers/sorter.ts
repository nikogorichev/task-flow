import type { Task } from "../types/Task";

onmessage = (e: MessageEvent<Task[]>) => {
  const sorted = [...e.data].sort((a, b) => {
    const order = { high: 3, medium: 2, low: 1 };
    return order[b.priority] - order[a.priority];
  });
  postMessage(sorted);
};
