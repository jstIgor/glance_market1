import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseInterceptors,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, OAuthLoginDto, RegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { SetAuthCookiesInterceptor } from 'src/interceptors/set-auth-cookie.interceptor';
import { RemoveAuthCookiesInterceptor } from 'src/interceptors/remove-auth-cookie.interceptor';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiResponse({ status: 200, description: 'Успешный вход' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @HttpCode(200)
  @Post('login')
  @UseInterceptors(SetAuthCookiesInterceptor)
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.login(dto);
    return user;
  }

  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({ status: 200, description: 'Токен успешно обновлен' })
  @ApiResponse({ status: 401, description: 'Невалидный refresh token' })
  @HttpCode(200)
  @Get('refresh')
  @UseInterceptors(SetAuthCookiesInterceptor)
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    const user = await this.authService.refresh(refreshToken);
    return user;
  }

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @Post('register')
  @HttpCode(200)
  @UseInterceptors(SetAuthCookiesInterceptor)
  async register(@Body() dto: RegisterDto) {
    try {
      console.log('dto', dto)
      const result = await this.authService.register(dto);
      if (!result) {
        throw new InternalServerErrorException('Registration failed');
      }
      return result;
    } catch (error) {
      // Log the error
      console.error('Registration controller error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiResponse({ status: 200, description: 'Успешный выход' })
  @Post('logout')
  @HttpCode(200)
  @UseInterceptors(RemoveAuthCookiesInterceptor)
  async logout(@Req() request: Request) {
    return;
  }

  @ApiOperation({ summary: 'Аутентификация через Яндекс' })
  @ApiResponse({ status: 200, description: 'Успешная аутентификация' })
  @Get('oauth/yandex')
  @HttpCode(200)
  @UseInterceptors(SetAuthCookiesInterceptor)
  async yandexAuth(
    @Req() dto: OAuthLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // @ts-ignore
    const { user, accessToken, refreshToken } =
      await this.authService.validateOAuthLogin(dto);
    return {
      refreshToken,
      redirect: `${process.env.FRONTEND_URL}/oauth/dashboard?accessToken=${accessToken}`,
    };
  }

  @ApiOperation({ summary: 'Аутентификация через VK' })
  @ApiResponse({ status: 200, description: 'Успешная аутентификация' })
  @Get('oauth/vk')
  @HttpCode(200)
  @UseInterceptors(SetAuthCookiesInterceptor)
  async vkontakteAuth(
    @Req() dto: OAuthLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    //@ts-ignore
    const { user, accessToken, refreshToken } =
      await this.authService.validateOAuthLogin(dto);
    return {
      refreshToken,
      redirect: `${process.env.FRONTEND_URL}/oauth/dashboard?accessToken=${accessToken}`,
    };
  }

  @ApiOperation({ summary: 'Callback для VK OAuth' })
  @Get('oauth/vk/callback')
  @HttpCode(200)
  async vkontakteAuthCallback(@Req() request: Request) {}

  @ApiOperation({ summary: 'Callback для Яндекс OAuth' })
  @Get('oauth/yandex/callback')
  @HttpCode(200)
  async yandexAuthCallback(@Req() request: Request) {}
}
