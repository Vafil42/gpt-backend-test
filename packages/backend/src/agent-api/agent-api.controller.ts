import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { AgentApiService } from "./agent-api.service";
import { Request } from "express";
import { UpdateAgentDto } from "src/agent/dto/update-agent.dto";
import { MessageDto } from "./dto/message.dto";
import { Dialog } from "src/token/schemas/dialog";
import { Agent } from "src/agent/schemas/agent.schema";

@Controller("agent-api")
export class AgentApiController {
  constructor(private agentApiService: AgentApiService) {}

  @Get()
  async getAgent(@Req() req: Request) {
    return await this.agentApiService.getAgent(req.agentLogin);
  }

  @Patch()
  async updateAgent(@Req() req: Request, @Body() dto: UpdateAgentDto) {
    const login = await this.agentApiService.updateAgent(req.agentLogin, dto);

    return { login };
  }

  @Delete("dialog/:id")
  async deleteDialog(
    @Req() req: Request,
    @Param("id") id: string,
  ): Promise<void> {
    return await this.agentApiService.deleteDialog(id, req.agentLogin);
  }

  @Post("dialog")
  async createDialog(@Req() req: Request, @Body() body: MessageDto) {
    const dialog = await this.agentApiService.createDialog(
      req.agentLogin,
      body.message,
    );

    return {
      messages: dialog.messages,
      id: dialog.id,
    };
  }

  @Post("dialog/:id/message")
  async sendMessage(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() body: MessageDto,
  ) {
    const dialog = await this.agentApiService.sendMessage(
      id,
      body.message,
      req.agentLogin,
    );

    return {
      messages: dialog.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    };
  }
}
