import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifiedCallback, VerifyCallback } from 'passport-jwt';
import { Profile } from 'passport-yandex';
import { Strategy } from 'passport-yandex';
import { UserService } from 'src/user/user.service';
import { PassportStrategy } from '@nestjs/passport';
import { IOAuthUser } from '../interfaces/oAuth.user';


@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
      callbackURL:
        configService.getOrThrow<string>('SERVER_URL') +
        '/auth/oauth/yandex/callback',
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<void> {
    try {
      const { emails, displayName, photos } = profile;
  
      if (!emails?.[0]?.value) {
        return done(null, false, { message: 'Email not provided by VKontakte' });
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
