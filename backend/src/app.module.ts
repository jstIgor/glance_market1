import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './config/jwtConfig';
import { YandexStrategy } from './auth/strategies/yandex.strategy';
import { VkontakteStrategy } from './auth/strategies/vkontakte.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { CatalogModule } from './catalog/catalog.module';
@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    CatalogModule
  ],
  controllers: [],
  providers: [
    YandexStrategy,
    VkontakteStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
