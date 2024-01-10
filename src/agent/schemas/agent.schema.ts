import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AgentDocument = HydratedDocument<Agent>;

@Schema()
export class Agent {
  @Prop()
  login: string;

  @Prop()
  password: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
