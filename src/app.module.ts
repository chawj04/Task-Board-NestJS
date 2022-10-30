import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TaskBoardsModule } from './task-boards/task-boards.module';
import { ConfigModule } from '@nestjs/config';
import { UsersEntity } from './users/entities/users.entity';
import { TaskBoardsEntity } from './task-boards/entities/tasks.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MySQL_Connection_Setting
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UsersEntity, TaskBoardsEntity],
      synchronize: true,
      // Time - Seoul
      timezone: 'Z',
    }),
    UsersModule,
    AuthModule,
    TaskBoardsModule,
  ],
  controllers: [AppController],
})

// Logger_Middleware_Setting
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
