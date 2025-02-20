import { IsString } from "class-validator";
import { IOAuthUser } from "../interfaces/oAuth.user";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Имя пользователя' })
  @IsString()
  name: string;
}

export class OAuthLoginDto implements IOAuthUser {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Имя пользователя' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'http://example.com/image.jpg', description: 'URL изображения пользователя', required: false })
  @IsString()
  image?: string;

  @ApiProperty({ example: 'http://example.com/picture.jpg', description: 'URL фотографии пользователя', required: false })
  @IsString()
  picture?: string;
}
