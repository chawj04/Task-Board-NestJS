import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { multerOptions } from 'src/common/utils/multer.options';
import { UserRole, UsersEntity } from 'src/users/entities/users.entity';
import { InsertResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
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
  // Find_All_Task
  // Update_Task
  // Remove_Task

  //Upload_Task_Files
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions('task')))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return { image: `http://localhost:8888/files/task/${files[0].filename}` };
    // return this.taskBoardsService.uploadFile()
  }
}
