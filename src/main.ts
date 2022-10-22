import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // class-validation 동작을 위해 사용
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Security
  app.use(
    ['/api', '/api-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        ['admin']: '1234',
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Task-Board-NestJS')
    .setDescription('Task-Board-API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8888);
}
bootstrap();
