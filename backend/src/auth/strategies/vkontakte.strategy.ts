import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifiedCallback, VerifyCallback } from 'passport-jwt';
import { Profile } from 'passport-vkontakte';
import { Strategy } from 'passport-vkontakte';
import { PassportStrategy as VKStrategy } from '@nestjs/passport';
import { IOAuthUser } from '../interfaces/oAuth.user';
@Injectable()
export class VkontakteStrategy extends VKStrategy(Strategy, 'vkontakte') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('VKONTAKTE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('VKONTAKTE_CLIENT_SECRET'),
      callbackURL:
        configService.getOrThrow<string>('SERVER_URL') +
        '/auth/oauth/vk/callback',
      profileFields: ['email', 'name', 'photos'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<void> {
    const { emails, displayName, photos } = profile;

    if (!emails?.[0]?.value) {
      done(new Error('email is not provided by VKontakte'), null);
      return;
    }

    const user: IOAuthUser = {
      email: emails[0].value,
      name: displayName ?? '',
      picture: photos?.[0]?.value,
    };

    done(null, user);

  }
}
