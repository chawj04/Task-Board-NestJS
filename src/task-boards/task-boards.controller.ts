import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { multerOptions } from '../common/utils/multer.options';
import { UserRole, UsersEntity } from '../users/entities/users.entity';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-taks.dto';
import { UploadFilesDto } from './dto/upload-files.dto';
import { TaskBoardsEntity } from './entities/tasks.entity';
import { TaskBoardsService } from './task-boards.service';

@ApiTags('Task-Boards')
@Controller('task-boards')
export class TaskBoardsController {
  constructor(private readonly taskBoardsService: TaskBoardsService) {}

  // Test_Get_Current_User
  // @Post('test')
  // @Auth(UserRole.User, UserRole.Admin)
  // getUsers(@CurrentUser() user: UsersEntity) {
  //   console.log('user', user);
  //   return user;
  // }

  // Regist_NewTask
  @Post('regist')
  @Auth(UserRole.User, UserRole.Admin)
  async registNewTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @CurrentUser() currentUser: UsersEntity,
  ): Promise<InsertResult | TaskBoardsEntity> {
    // console.log('controller', currentUser);
    return await this.taskBoardsService.insertNewTask(
      createTaskDto,
      currentUser,
    );
  }

  // Find_Task
  @Auth(UserRole.Admin, UserRole.User)
  @Get('task-info/:taskIndex')
  async findTask(
    @Param('taskIndex', new ParseIntPipe()) taskIndex: number,
    @CurrentUser() currentUser: UsersEntity,
  ): Promise<TaskBoardsEntity> {
    return await this.taskBoardsService.getTask(+taskIndex, currentUser);
  }

  // Find_All_Task
  @Auth(UserRole.Admin, UserRole.User)
  @Get()
  async findAllTask(
    @CurrentUser() currentUser: UsersEntity,
  ): Promise<TaskBoardsEntity[]> {
    return await this.taskBoardsService.getTaskList(currentUser);
  }

  // Update_Task
  @Auth(UserRole.Admin, UserRole.User)
  @Patch('task-info/:taskIndex')
  async updateTask(
    @Param('taskIndex', new ParseIntPipe()) taskIndex: number,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
    @CurrentUser() currentUser: UsersEntity,
  ): Promise<UpdateResult> {
    return await this.taskBoardsService.editTask(
      currentUser,
      +taskIndex,
      updateTaskDto,
    );
  }

  // Remove_Task
  @Delete('task-info/:taskIndex')
  @Auth(UserRole.User, UserRole.Admin)
  async removeTask(
    @Param('taskIndex', new ParseIntPipe()) taskIndex: number,
    @CurrentUser() currentUser: UsersEntity,
  ): Promise<DeleteResult> {
    return await this.taskBoardsService.deleteTask(+taskIndex, currentUser);
  }

  // Upload_Task_Files
  @Post('upload/:taskIndex')
  @Auth(UserRole.User, UserRole.Admin)
  @UseInterceptors(FilesInterceptor('files', 5, multerOptions('task')))
  async uploadFile(
    @CurrentUser() currentUser: UsersEntity,
    @Param('taskIndex', new ParseIntPipe()) taskIndex: number,
    @Body(ValidationPipe) uploadFilesDto: UploadFilesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UpdateResult> {
    // console.log('controller', `${files[0].filename}`);
    return await this.taskBoardsService.uploadFile(
      currentUser,
      +taskIndex,
      uploadFilesDto,
      files,
    );
  }
}
