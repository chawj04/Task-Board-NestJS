import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TaskBoardsModule } from './task-boards/task-boards.module';
import { ConfigModule } from '@nestjs/config';
import { UsersEntity } from './users/entities/users.entity';
import { TaskBoardsEntity } from './task-boards/entities/tasks.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    // MySQL_Connection_Config_Setting
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
    AuthModule,
    TaskBoardsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
