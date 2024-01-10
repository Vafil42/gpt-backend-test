import { Body, Controller, Post } from "@nestjs/common";
import { AgentService, TokenResponseInterface } from "./agent.service";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { LoginAgentDto } from "./dto/login-agent.dto";
import { Public } from "src/decorators/public";

@Controller("auth")
export class AgentController {
  constructor(private agentService: AgentService) { }

  @Public()
  @Post("/sing-up")
  async signUp(@Body() dto: CreateAgentDto): Promise<TokenResponseInterface> {
    return await this.agentService.create(dto);
  }

  @Public()
  @Post("/login")
  async login(@Body() dto: LoginAgentDto): Promise<TokenResponseInterface> {
    return await this.agentService.login(dto);
  }
}
