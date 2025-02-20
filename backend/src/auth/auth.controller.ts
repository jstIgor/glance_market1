import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, OAuthLoginDto, RegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { SetAuthCookiesInterceptor } from 'src/interceptors/set-auth-cookie.interceptor';
import { RemoveAuthCookiesInterceptor } from 'src/interceptors/remove-auth-cookie.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  @UseInterceptors(SetAuthCookiesInterceptor)
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.login(dto);
    return user;
  }

  @HttpCode(200)
  @Get('refresh')
  @UseInterceptors(SetAuthCookiesInterceptor)
  async refresh(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    const user = await this.authService.refresh(refreshToken);
    return user;
  }

  @Post('register')
  @HttpCode(200)
  @UseInterceptors(SetAuthCookiesInterceptor)
  async regiter(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return user;
  }

  @Post('logout')
  @HttpCode(200)
  @UseInterceptors(RemoveAuthCookiesInterceptor)
  async logout(@Req() request: Request) {
    return;
  }

  @Get('oauth/yandex')
  @HttpCode(200)
  @UseInterceptors(SetAuthCookiesInterceptor)
  async yandexAuth(
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
  @Get('oauth/vk/callback')
  @HttpCode(200)
  async vkontakteAuthCallback(@Req() request: Request) {}

  @Get('oauth/yandex/callback')
  @HttpCode(200)
  async yandexAuthCallback(@Req() request: Request) {}
}
