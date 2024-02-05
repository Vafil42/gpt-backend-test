import {
  HttpException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Secret } from "./schemas/secret";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { HttpService } from "@nestjs/axios";
import { Interval } from "@nestjs/schedule";
import { config } from "../common/dotenv";

config();

@Injectable()
export class RefreshTokenService implements OnApplicationBootstrap {
  private readonly logger = new Logger("RefreshTokenService");
  constructor(
    @InjectModel(Secret.name) private secretModel: Model<Secret>,
    private httpService: HttpService,
  ) { }

  async getToken(): Promise<string> {
    const secret = await this.secretModel.findOne();

    if (!secret) {
      throw new HttpException("Server unavailable", 503);
    }

    return secret.authorization;
  }

  async refreshToken(): Promise<void> {
    if (this.secretModel) await this.secretModel.findOneAndDelete();

    const res = await this.httpService.axiosRef.request({
      url: process.env.REFRESH_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${process.env.REFRESH_SECRET}`,
        RqUID: uuidv4(),
      },
      data: { scope: "GIGACHAT_API_PERS" },
    });

    if (res.status !== 200) {
      this.logger.error(
        "Request to refresh token failed with status",
        res.status,
      );
      throw new Error("Request to refresh token failed");
    }

    const secret = new this.secretModel({
      authorization: `Bearer ${res.data.access_token}`,
      expires: new Date(res.data.expires_at),
    });
    secret.save();

    this.logger.log("Token refreshed");
  }

  async onApplicationBootstrap() {
    await this.refreshToken();
  }

  @Interval(29 * 60 * 1000)
  async onInterval() {
    await this.refreshToken();
  }
}
