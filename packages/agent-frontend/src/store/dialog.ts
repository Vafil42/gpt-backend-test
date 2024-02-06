import { makeAutoObservable } from "mobx";
import { apiRequest } from "../common/apiRequest";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export class DialogStore {
  constructor() {
    makeAutoObservable(this);
  }

  data: { messages: Message[] } = { messages: [] };

  id!: string;

  addMessage = async (message: string, auth: string) => {
    this.data.messages.push({ role: "user", content: message });

    if (!this.id) {
      return await this.create(message, auth);
    }

    const { data: dialog, ok } = await apiRequest({
      additionalUrl: `agent-api/dialog/${this.id}/message`,
      method: "POST",
      body: {
        message,
      },
      auth,
    });

    if (ok) {
      this.data.messages = dialog.messages;
    }

    return ok;
  };

  create = async (message: string, auth: string) => {
    const { data: dialog, ok } = await apiRequest({
      additionalUrl: "agent-api/dialog",
      method: "POST",
      body: {
        message,
      },
      auth,
    });

    if (ok) {
      this.id = dialog.id;
      this.data.messages = dialog.messages;
    }

    return ok;
  };

  clear = async (auth: string) => {
    await apiRequest({
      additionalUrl: `agent-api/dialog/${this.id}`,
      method: "DELETE",
      auth,
      doNotParse: true,
    });

    this.data.messages = [];
    this.id = "";
  };
}
