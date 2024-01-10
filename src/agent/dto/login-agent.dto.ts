import { IsString, IsDefined } from "class-validator";

export class LoginAgentDto {
  @IsString()
  @IsDefined()
  login: string;

  @IsString()
  @IsDefined()
  password: string;
}
