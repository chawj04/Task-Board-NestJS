import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-taks.dto';
import { TaskBoardsEntity } from './entities/tasks.entity';
import { TaskBoardsService } from './task-boards.service';

@ApiTags('Task-Boards')
@Controller('task-boards')
export class TaskBoardsController {
  constructor(private readonly taskBoardsService: TaskBoardsService) {}

  // Regist_NewTask
  @Post('regist')
  registNewTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<InsertResult> {
    return this.taskBoardsService.insertNewTask(createTaskDto);
  }

  // Find_Task
  @Get(':taskIndex')
  findTask(
    @Param('taskIndex', new ParseIntPipe())
    taskIndex: number,
  ): Promise<TaskBoardsEntity> {
    return this.taskBoardsService.getTask(+taskIndex);
  }

  // Find_All_Task
  @Get()
  findAllTask(): Promise<TaskBoardsEntity[]> {
    return this.taskBoardsService.getTaskList();
  }

  // Update_Task
  @Patch(':taskIndex')
  updateTask(
    @Param('taskIndex') taskIndex: number,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateResult> {
    return this.taskBoardsService.editTask(+taskIndex, updateTaskDto);
  }

  // Remove_Task
  @Delete(':taskIndex')
  deleteTask(
    @Param('taskIndex', new ParseIntPipe())
    taskIndex: number,
  ): Promise<DeleteResult> {
    return this.taskBoardsService.removeTask(+taskIndex);
  }
}
