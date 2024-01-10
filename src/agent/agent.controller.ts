import { Body, Controller, Post } from "@nestjs/common";
import { AgentService, TokenResponseInterface } from "./agent.service";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { LoginAgentDto } from "./dto/login-agent.dto";

@Controller("auth")
export class AgentController {
  constructor(private agentService: AgentService) { }

  @Post("/signin")
  async signIn(@Body() dto: CreateAgentDto): Promise<TokenResponseInterface> {
    return await this.agentService.create(dto);
  }

  @Post("/login")
  async login(@Body() dto: LoginAgentDto): Promise<TokenResponseInterface> {
    return await this.agentService.login(dto);
  }
}
