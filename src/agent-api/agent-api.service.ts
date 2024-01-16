import { HttpException, Injectable } from "@nestjs/common";
import { AgentService } from "src/agent/agent.service";
import { UpdateAgentDto } from "src/agent/dto/update-agent.dto";
import { TokenService } from "src/token/token.service";

@Injectable()
export class AgentApiService {
  constructor(
    private agentService: AgentService,
    private tokenService: TokenService,
  ) { }

  async getAgent(login: string) {
    return await this.agentService.getAgent(login);
  }

  async updateAgent(login: string, dto: UpdateAgentDto) {
    return await this.agentService.updateAgent(login, dto);
  }

  async deleteDialog(id: string, agentLogin: string) {
    const dialog = await this.tokenService.getDialog(id);

    if (dialog.agent.login !== agentLogin) {
      throw new HttpException("Unauthorized", 401);
    }

    await this.tokenService.deleteDialog(id);
  }

  async createDialog(agentLogin: string, message: string) {
    return await this.tokenService.createDialog(agentLogin, message);
  }

  async sendMessage(dialogId: string, message: string, agentLogin: string) {
    const dialog = await this.tokenService.getDialog(dialogId);

    if (dialog.agent.login !== agentLogin) {
      throw new HttpException("Unauthorized", 401);
    }

    return await this.tokenService.sendMessage(dialog.id, message);
  }
}
