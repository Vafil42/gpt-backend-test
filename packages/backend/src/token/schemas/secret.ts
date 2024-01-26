import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SecretDocument = HydratedDocument<Secret>;

@Schema()
export class Secret {
  @Prop({ required: true })
  authorization: string;

  @Prop({ required: true })
  expires: Date;
}

export const SecretSchema = SchemaFactory.createForClass(Secret);
