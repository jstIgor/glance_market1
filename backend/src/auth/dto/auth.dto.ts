import { IsString } from "class-validator";
import { IOAuthUser } from "../interfaces/oAuth.user";

export class AuthDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class RegisterDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString()
  name: string;
}

export class OAuthLoginDto implements IOAuthUser {
  @IsString()
  email: string;
  @IsString()
  name: string;
  @IsString()
  image?: string;
  @IsString()
  picture?: string;
}
