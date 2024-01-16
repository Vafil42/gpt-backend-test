import { makeAutoObservable } from "mobx";

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
      this.create(message, auth);
      return;
    }

    const res = await fetch(
      `http://localhost:8080/agent-api/dialog/${this.id}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          message,
        }),
      },
    );

    if (res.ok) {
      const dialog = await res.json();
      console.log(dialog);
      this.data.messages = dialog.messages;
    }

    return res.ok;
  };

  create = async (message: string, auth: string) => {
    const res = await fetch("http://localhost:8080/agent-api/dialog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        message,
      }),
    });

    if (res.ok) {
      const dialog = await res.json();
      this.id = dialog.id;
      this.data.messages = dialog.messages;
    }

    return res.ok;
  };

  clear = async (auth: string) => {
    await fetch(`http://localhost:8080/agent-api/dialog/${this.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    });

    this.data.messages = [];
    this.id = "";
  };
}
