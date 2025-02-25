import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
  .setTitle('Glance Market API')
  .setDescription('API документация для Glance Market')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('auth', 'Аутентификация и авторизация')
  .addTag('users', 'Операции с пользователями')
  .addServer(configService.getOrThrow('SERVER_URL'))
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
    exposedHeaders: ['set-cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  await app.listen(Number(configService.getOrThrow('PORT')) ?? 3000);
  console.log(`Server is running on port ${configService.getOrThrow('PORT')}`);
}
bootstrap();
