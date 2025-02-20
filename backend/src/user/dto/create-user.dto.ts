import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
  }, { message: 'Password must be strong' })
  password: string

  @ApiProperty({ example: 'John Doe' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(1, 20, { message: 'Name must be between 1 and 20 characters' })
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Picture must be a string' })
  picture?: string
}