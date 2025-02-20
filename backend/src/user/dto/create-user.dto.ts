import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length } from "class-validator";

export class CreateUserDto {
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
  }, { message: 'Password must be strong' })
  password: string

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(1, 20, { message: 'Name must be between 1 and 20 characters' })
  name: string

  @IsOptional()
  @IsString({ message: 'Picture must be a string' })
  picture?: string
}