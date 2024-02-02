import { Injectable } from "@nestjs/common";
import { AgentService } from "src/agent/agent.service";
import { LoginAgentDto } from "src/agent/dto/login-agent.dto";
import { TokenService } from "src/token/token.service";

@Injectable()
export class EntryService {
  constructor(
    private agentService: AgentService,
    private tokenService: TokenService,
  ) {}

  async login(dto: LoginAgentDto) {
    return await this.agentService.login(dto);
  }

  async sendMessageWithUserId(
    userId: string,
    agentLogin: string,
    message: string,
  ) {
    const dialog = await this.tokenService.getDialogWithUserId(
      userId,
      agentLogin,
    );

    return await this.tokenService.sendMessage(dialog, message);
  }

  async deleteDialogWithUserId(userId: string, agentLogin: string) {
    const dialog = await this.tokenService.getDialogWithUserId(
      userId,
      agentLogin,
    );

    await this.tokenService.deleteDialog(dialog.id);
  }
}
