import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Dialog } from "./schemas/dialog";
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

  async getDialog(id: string, agentLogin: string): Promise<Dialog> {
    const dialog = await this.dialogModel.findById(id);

    if (!dialog) throw new HttpException("Dialog not found", 404);

    if (dialog.agent.login !== agentLogin)
      throw new HttpException("Not enough permissions", 403);

    return dialog;
  }

  async createDialog(agentLogin: string, message: string): Promise<Dialog> {
    const agent = await this.agentService.getAgent(agentLogin);

    const dialog = new this.dialogModel({
      agent,
    });
    dialog.save();

    return await this.sendMessage(dialog, message, agent.promptTempature);
  }

  async sendMessage(
    dialog: Dialog,
    message: string,
    tempature: number,
  ): Promise<Dialog> {
    const userMessage = this.genUserMessage(dialog.agent, message);

    const updatedDialog = await this.dialogModel.findOneAndUpdate(
      { _id: dialog._id },
      {
        messages: [...dialog.messages, { role: "user", content: userMessage }],
      },
      { new: true },
    );

    if (!updatedDialog) throw new HttpException("Dialog not found", 404);

    updatedDialog.save();

    console.log(updatedDialog.messages);

    const res = await this.httpService.axiosRef.request({
      method: "POST",
      url: process.env.API_URL + "/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: await this.refreshTokenService.getToken(),
      },
      data: {
        model: "GigaChat:latest",
        messages: updatedDialog.messages,
        temperature: tempature,
      },
    });

    if (res.status !== 200) {
      throw new HttpException("Server unavailable", 503);
    }

    const finalDialog = await this.dialogModel.findOneAndUpdate(
      { _id: updatedDialog._id },
      {
        messages: [...updatedDialog.messages, res.data.choices[0].message],
      },
      { new: true },
    );

    if (!finalDialog) throw new HttpException("Dialog not found", 404);

    return finalDialog;
  }

  private genUserMessage(agent: Agent, messages: string) {
    const message =
      agent.promptFirstPart ?? "" + messages + (agent.promptSecondPart ?? "");

    return message;
  }
}
