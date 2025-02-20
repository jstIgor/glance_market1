import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto, OAuthLoginDto, RegisterDto } from './dto/auth.dto';
import { comparePassword } from 'src/lib/utils/hash';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.generateTokens((user as User).id);
    return {
      user,
      ...tokens,
    };
  }

  async register(dto: RegisterDto) {
    try {
      const user = await this.userService.createUser({
        email: dto.email,
        password: dto.password,
        name: dto.name,
      });

      if (!user) {
        throw new InternalServerErrorException('Failed to create user');
      }

      const tokens = this.generateTokens((user as User).id);
      return {
        user,
        ...tokens,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle Prisma-specific errors
        if (error.code === 'P2002') {
          throw new BadRequestException('Email already exists');
        }
      }
      // Log the error for debugging
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  private generateTokens(userId: string) {
    const payload = { id: userId };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  private async validateUser(dto: AuthDto): Promise<User | NotFoundException> {
      const user = await this.userService.getUserByEmail(dto.email);
      if(!user){
        throw new NotFoundException('Пользователь с таким email не найден');
      }
      const isValidPassword = comparePassword(
        dto.password,
        (user as User).password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('Неверный логин или пароль');
      }
      return user;
  }

  async refresh(refreshToken: string): Promise<any> {
    const data = this.jwtService.verify(refreshToken);
    let user;
    try {
      user = await this.userService.getUserById(data.id);
    } catch (NotFoundException) {
      throw new BadRequestException(
        'refresh token is deprecated; user not found',
      );
    } finally {
      const tokens = this.generateTokens((user as User).id);
      return {
        user,
        ...tokens,
      };
    }
  }

  async validateOAuthLogin(dto: OAuthLoginDto) {
    try {
      const user = await this.userService.getUserByEmail(dto.email);
    } catch (NotFoundExeption) {
      const newUser = await this.userService.createUser({
        email: dto.email,
        name: dto.name,
        password: '',
        picture: dto.picture,
      });
      const tokens = this.generateTokens((newUser as User).id);
      return {
        user: newUser,
        ...tokens,
      };
    }
  }
}
