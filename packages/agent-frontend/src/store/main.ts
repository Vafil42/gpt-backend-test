import { AgentStore } from "./agent";
import { DialogStore } from "./dialog";

export class MainStore {
  agentStore = new AgentStore();
  dialogStore = new DialogStore();
}
