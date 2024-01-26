import { IsString, IsDefined } from "class-validator";

export class CreateAgentDto {
  @IsString()
  @IsDefined()
  login: string;

  @IsString()
  @IsDefined()
  password: string;
}
