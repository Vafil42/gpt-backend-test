import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Dialog, DialogDocument } from "./schemas/dialog";
import { Model } from "mongoose";
import { RefreshTokenService } from "./refresh.service";
import { AgentService } from "src/agent/agent.service";
import { Agent } from "src/agent/schemas/agent.schema";
import { HttpService } from "@nestjs/axios";

import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Dialog.name) private dialogModel: Model<Dialog>,
    private httpService: HttpService,
    private refreshTokenService: RefreshTokenService,
    private agentService: AgentService,
  ) { }

  async getDialog(id: string): Promise<DialogDocument> {
    const dialog = await this.dialogModel.findById(id, null, {
      populate: ["agent", "messages"],
    });

    console.log(dialog);

    if (!dialog) throw new HttpException("Dialog not found", 404);

    return dialog;
  }

  async createDialog(
    agentLogin: string,
    message: string,
  ): Promise<DialogDocument> {
    const agent = await this.agentService.getAgent(agentLogin);

    const dialog = new this.dialogModel({
      agent,
    });
    await dialog.save();

    console.log(dialog);

    return await this.sendMessage(dialog, message);
  }

  async sendMessage(
    dialog: DialogDocument,
    message: string,
  ): Promise<DialogDocument> {
    console.log(dialog);

    dialog.messages.push({
      role: "user",
      content: message,
    });

    await dialog.save();

    const res = await this.httpService.axiosRef.request({
      method: "POST",
      url: process.env.API_URL + "/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: await this.refreshTokenService.getToken(),
      },
      data: {
        model: "GigaChat:latest",
        messages: dialog.messages.map((message) => {
          if (message.role === "user") {
            return {
              role: "user",
              content: this.genUserMessage(dialog.agent, message.content),
            };
          }

          return {
            role: "assistant",
            content: message.content,
          };
        }),
        temperature: dialog.agent.promptTempature,
      },
    });

    if (res.status !== 200) {
      throw new HttpException("Server unavailable", 503);
    }

    dialog.messages.push({
      role: "assistant",
      content: res.data.choices[0].message.content,
    });

    await dialog.save();

    return dialog;
  }

  private genUserMessage(agent: Agent, messages: string) {
    const message =
      (agent.promptFirstPart ?? "") + messages + (agent.promptSecondPart ?? "");

    return message;
  }

  async deleteDialog(id: string) {
    await this.dialogModel.findByIdAndDelete(id);
  }
}
