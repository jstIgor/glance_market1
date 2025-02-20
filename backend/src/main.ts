import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(Number(configService.getOrThrow('PORT')) ?? 3000);
  app.use(cookieParser());
  app.enableCors({
    origin: [configService.getOrThrow('CLIENT_URL')],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
}
bootstrap();
