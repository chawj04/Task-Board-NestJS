import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config_Setting
  const nestServerConfig = config.get('server');
  const swaggerSecurityConfig = config.get('swagger');

  // class-validation 동작을 위해 사용
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Security
  app.use(
    ['/api', '/api-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [swaggerSecurityConfig.id]: swaggerSecurityConfig.password,
      },
    }),
  );

  // Swagger
  const nestSwaggerConfig = new DocumentBuilder()
    .setTitle('Task-Board-NestJS')
    .setDescription('Task-Board-API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, nestSwaggerConfig);
  SwaggerModule.setup('api', app, document);

  // nestServerConfig - Setting_Port
  const port = nestServerConfig.port;
  await app.listen(port);

  //Logger
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
