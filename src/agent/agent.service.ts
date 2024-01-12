import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Agent } from "./schemas/agent.schema";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginAgentDto } from "./dto/login-agent.dto";

export interface TokenResponseInterface {
  token: string;
}

interface TokenPayloadInterface {
  login: string;
}

@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<Agent>,
    private jwtService: JwtService,
  ) { }

  async create(dto: CreateAgentDto): Promise<TokenResponseInterface> {
    const existingAgent = await this.agentModel.findOne({ login: dto.login });

    if (existingAgent) {
      throw new HttpException("Agent already exists", 400);
    }

    const hashPassword = await bcrypt.hash(dto.password, bcrypt.genSaltSync());

    const agent = new this.agentModel({
      login: dto.login,
      password: hashPassword,
    });

    await agent.save();

    return await this.generateToken({ login: agent.login });
  }

  async login(dto: LoginAgentDto): Promise<TokenResponseInterface> {
    const agent = await this.agentModel.findOne({ login: dto.login });

    if (!agent) {
      throw new HttpException("Invalid login or password", 401);
    }

    const isMatch = await bcrypt.compare(dto.password, agent.password);

    if (!isMatch) {
      throw new HttpException("Invalid login or password", 401);
    }

    return await this.generateToken({ login: agent.login });
  }

  private async generateToken(
    payload: TokenPayloadInterface,
  ): Promise<TokenResponseInterface> {
    const token = `Bearer ${await this.jwtService.signAsync(payload)}`;

    return { token };
  }

  async getAgent(login: string): Promise<Agent> {
    const agent = await this.agentModel.findOne({ login });

    if (!agent) throw new HttpException("Agent not found", 404);

    return agent;
  }
}
