import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifiedCallback, VerifyCallback } from 'passport-jwt';
import { Profile, Strategy } from 'passport-vkontakte';
import { PassportStrategy } from '@nestjs/passport';
import { IOAuthUser } from '../interfaces/oAuth.user';

@Injectable()
export class VkontakteStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('VKONTAKTE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('VKONTAKTE_CLIENT_SECRET'),
      callbackURL:
        configService.getOrThrow<string>('SERVER_URL') +
        '/auth/oauth/vk/callback',
      profileFields: ['email', 'name', 'photos'],
      apiVersion: '5.131'
    });
  }

  /**
   * Валидация профиля пользователя, полученного от VK
   * @param _accessToken - OAuth access token
   * @param _refreshToken - OAuth refresh token
   * @param profile - Профиль пользователя VK
   * @param done - Callback для передачи результата
   */
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<void> {
    try {
      const { emails, displayName, photos } = profile;

      if (!emails?.[0]?.value) {
        done(new Error('Email не предоставлен VK'), null);
        return;
      }

      const user: IOAuthUser = {
        email: emails[0].value,
        name: displayName ?? '',
        picture: photos?.[0]?.value,
      };

      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
