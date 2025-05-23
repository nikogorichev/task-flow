import type { Task } from "../types/Task";

export type Message =
  | { type: 'task:add'; task: Task }
  | { type: 'get:state' }
  | { type: 'state:update'; tasks: Task[] };

let tasks: Task[] = [];
const ports: MessagePort[] = [];

(self as unknown as SharedWorkerGlobalScope).onconnect = (event: MessageEvent) => {
  const port = (event as MessageEvent & { ports: MessagePort[] }).ports[0];
  ports.push(port);

  port.onmessage = (e: MessageEvent<Message>) => {
    const msg = e.data;

    if (msg.type === 'task:add') {
      tasks.push(msg.task);
      broadcastState();
    }

    if (msg.type === 'get:state') {
      port.postMessage({ type: 'state:update', tasks });
    }
  };

  port.start();
};

function broadcastState() {
  for (const port of ports) {
    port.postMessage({ type: 'state:update', tasks });
  }
}