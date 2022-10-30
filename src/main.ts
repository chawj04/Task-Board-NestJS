import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Config_Setting
  const configService = app.get(ConfigService);

  // class-validation 동작을 위해 사용
  app.useGlobalPipes(new ValidationPipe());

  // File_Upload - dist/common/uploads/task
  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    // Ex) http://localhost:8888/files/task/task.png
    prefix: '/files',
  });

  // Swagger Security
  const swaggerSecurityId = configService.get('SWAGGER_SECURITY_ID');
  const swaggerSecurityPassword = configService.get(
    'SWAGGER_SECURITY_PASSWORD',
  );

  app.use(
    ['/api', '/api-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [swaggerSecurityId]: swaggerSecurityPassword,
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

  // Setting_Port
  const port = configService.get('NEST_SERVER_PORT');

  // Exception filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors({
    origin: ['http://localhost:8888', 'http://localhost:3000'],
    methods: 'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });

  // Helmet
  app.use(helmet());

  // CSRF
  // app.use(cookieParser());
  // app.use('/', csurf({ cookie: true }));
  // app.use((req: any, res: any, next: any) => {
  //   const token = req.csrfToken();
  //   res.cookie('XSRF-TOKEN', token);
  //   res.locals.csrfToken = token;
  //   next();
  // });

  await app.listen(port);

  //Logger
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
