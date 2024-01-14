import { IsOptional, IsString } from "class-validator";

export class UpdateAgentDto {
  @IsString()
  @IsOptional()
  prompt?: string;

  @IsString()
  @IsOptional()
  promptTempature?: number;
}
