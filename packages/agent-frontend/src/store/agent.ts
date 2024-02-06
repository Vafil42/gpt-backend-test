import { makeAutoObservable } from "mobx";
import { apiRequest } from "../common/apiRequest";

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
    const { data: agent, ok } = await apiRequest({
      additionalUrl: "agent-api",
      method: "GET",
      auth,
    });

    this.data = {
      prompt: agent.prompt,
      promptTempature: agent.promptTempature,
    };

    return ok;
  };

  editAgent = async (auth: string) => {
    const { ok } = await apiRequest({
      additionalUrl: "agent-api",
      method: "PATCH",
      body: {
        prompt: this.data!.prompt,
        promptTempature: this.data!.promptTempature,
      },
      auth,
      doNotParse: true,
    });

    return ok;
  };
}
