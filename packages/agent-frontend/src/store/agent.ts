import { makeAutoObservable } from "mobx";

export class AgentStore {
  constructor() {
    makeAutoObservable(this);
  }

  data?: {
    prompt: string;
    promptTempature: number;
  };

  setPrompt = (value: string) => (this.data!.prompt = value);

  setPromptTempature = (value: number) => (this.data!.promptTempature = value);

  loadAgent = async (auth: string) => {
    const res = await fetch(import.meta.env.BASE_URL + "api/agent-api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    });

    const agent = await res.json();

    this.data = {
      prompt: agent.prompt,
      promptTempature: agent.promptTempature,
    };
  };

  editAgent = async (auth: string) => {
    const res = await fetch(import.meta.env.BASE_URL + "api/agent-api", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        prompt: this.data!.prompt,
        promptTempature: this.data!.promptTempature,
      }),
    });

    if (res.ok) {
      return true;
    }

    return false;
  };
}
