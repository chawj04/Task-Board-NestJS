import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as config from 'config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Config_Setting
  const nestServerConfig = config.get('server');
  const swaggerSecurityConfig = config.get('swagger');

  // class-validation 동작을 위해 사용
  app.useGlobalPipes(new ValidationPipe());

  // File_Upload - dist/common/uploads/task
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    // Ex) http://localhost:8888/files/task/task.png
    prefix: '/files',
  });

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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
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
