import { Module } from "@nestjs/common";
import { MainModule } from "./main/main.module";
import { AgentModule } from "./agent/agent.module";
import { TokenModule } from "./token/token.module";
import { EntryModule } from "./entry/entry.module";
import { MongooseModule } from "@nestjs/mongoose";
import dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [
    MainModule,
    AgentModule,
    TokenModule,
    EntryModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
      { user: process.env.MONGODB_USER, pass: process.env.MONGODB_PASS },
    ),
  ],
})
export class AppModule { }
