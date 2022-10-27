import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TaskBoardsEntity } from './entities/tasks.entity';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { TaskBoardsController } from './task-boards.controller';
import { TaskBoardsService } from './task-boards.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TaskBoardsEntity, UsersEntity]),
    MulterModule.register({
      // File_저장 경로
      dest: './upload',
    }),
  ],
  controllers: [TaskBoardsController],
  providers: [TaskBoardsService, UsersService],
  exports: [TaskBoardsService],
})
export class TaskBoardsModule {}
