import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AgentDocument = HydratedDocument<Agent>;

@Schema()
export class Agent {
  @Prop({ unique: true, required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  promptFirstPart: string;

  @Prop()
  promptSecondPart: string;

  @Prop()
  promptTempature: number;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
