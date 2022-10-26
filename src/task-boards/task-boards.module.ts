import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskBoardsEntity } from './entities/tasks.entity';
import { TaskBoardsController } from './task-boards.controller';
import { TaskBoardsService } from './task-boards.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskBoardsEntity])],
  controllers: [TaskBoardsController],
  providers: [TaskBoardsService],
})
export class TaskBoardsModule {}
