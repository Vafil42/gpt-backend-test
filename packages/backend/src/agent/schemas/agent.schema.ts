import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AgentDocument = HydratedDocument<Agent>;

@Schema()
export class Agent {
  @Prop({ unique: true, required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  promptFirstPart: string;

  @Prop({ default: null })
  promptSecondPart: string;

  @Prop({ default: null })
  promptTempature: number;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
