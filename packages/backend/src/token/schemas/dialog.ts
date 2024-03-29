import { Prop, SchemaFactory, raw, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Agent } from "src/agent/schemas/agent.schema";

export type DialogDocument = HydratedDocument<Dialog>;

@Schema()
export class Dialog {
  @Prop({ type: [raw({ content: { type: String }, role: { type: String } })] })
  messages: { content: string; role: string }[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Agent" })
  agent: Agent;

  @Prop({ type: mongoose.Schema.Types.String, default: null })
  userId: string | null;
}

export const DialogSchema = SchemaFactory.createForClass(Dialog);
