import { Body, Controller, Delete, Param, Post, Req } from "@nestjs/common";
import { EntryService } from "./entry.service";
import { LoginAgentDto } from "src/agent/dto/login-agent.dto";
import { Public } from "src/decorators/public";
import { MessageDto } from "src/agent-api/dto/message.dto";
import { Request } from "express";

@Controller("entry")
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Public()
  @Post("login")
  async login(@Body() dto: LoginAgentDto) {
    return await this.entryService.login(dto);
  }

  @Post("dialogs/:userId")
  async sendMessage(
    @Body() message: MessageDto,
    @Param("userId") userId: string,
    @Req() req: Request,
  ) {
    return await this.entryService.sendMessageWithUserId(
      userId,
      req.agentLogin,
      message.message,
    );
  }

  @Delete("dialogs/:userId")
  async deleteDialog(@Param("userId") userId: string, @Req() req: Request) {
    await this.entryService.deleteDialogWithUserId(userId, req.agentLogin);
  }
}
