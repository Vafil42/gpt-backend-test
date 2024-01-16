import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAgentDto {
  @IsString()
  @IsOptional()
  prompt?: string;

  @IsNumber()
  @IsOptional()
  promptTempature?: number;
}
