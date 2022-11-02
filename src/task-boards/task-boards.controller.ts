import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
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
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';
import {
  PaginationQuery,
  TaskBoardsResponse,
  TaskBoardsSucessResponse,
} from './dto/task-boards-response.dto';

@ApiTags('Task-Boards')
@Controller('task-boards')
@UseInterceptors(new SuccessInterceptor())
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
  @Auth(UserRole.User, UserRole.Admin)
  @Post('regist')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Task_일감 등록',
    description: '일감 등록 API',
  })
  @ApiResponse({
    status: 201,
    description: 'Response Sucess',
    type: TaskBoardsResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: TaskName & description should not be empty',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Task_개별 일감 찾기',
    description: '개별 일감 찾기 API',
  })
  @ApiResponse({
    status: 200,
    description: 'Response Sucess',
    type: TaskBoardsResponse,
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found: You do not have permission to view this post - Number',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async findTask(
    @Param('taskIndex', new ParseIntPipe()) taskIndex: number,
    @CurrentUser() currentUser: UsersEntity,
  ): Promise<TaskBoardsEntity> {
    return await this.taskBoardsService.getTask(+taskIndex, currentUser);
  }

  // Find_All_Task
  @Auth(UserRole.Admin, UserRole.User)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Task_전체 일감 찾기',
    description: '전체 일감 찾기 API',
  })
  @ApiResponse({
    status: 200,
    isArray: true,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            anyOf: [
              { $ref: getSchemaPath(TaskBoardsResponse) },
              { $ref: getSchemaPath(TaskBoardsResponse) },
              { $ref: getSchemaPath(TaskBoardsResponse) },
              { $ref: getSchemaPath(TaskBoardsResponse) },
              { $ref: getSchemaPath(TaskBoardsResponse) },
              { $ref: getSchemaPath(TaskBoardsResponse) },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async findAllTask(
    @CurrentUser() currentUser: UsersEntity,
    @Query() query: PaginationQuery,
  ): Promise<TaskBoardsEntity[]> {
    return await this.taskBoardsService.getTaskList(
      currentUser,
      query.page,
      query.pageSize,
    );
  }

  // Update_Task
  @Auth(UserRole.Admin, UserRole.User)
  @Patch('task-info/:taskIndex')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Task_일감 수정',
    description: '일감 수정 API',
  })
  @ApiResponse({
    status: 200,
    description: 'Response Sucess',
    type: TaskBoardsSucessResponse,
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found: You do not have permission to view this post - Number',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
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
  @Auth(UserRole.User, UserRole.Admin)
  @Delete('task-info/:taskIndex')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Task_개별 일감 삭제',
    description: '개별 일감 삭제 API',
  })
  @ApiResponse({
    status: 200,
    description: 'Response Sucess',
    type: TaskBoardsSucessResponse,
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found: You do not have permission to view this post - Number',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async removeTask(
    @Param('taskIndex', new ParseIntPipe()) taskIndex: number,
    @CurrentUser() currentUser: UsersEntity,
  ): Promise<DeleteResult> {
    return await this.taskBoardsService.deleteTask(+taskIndex, currentUser);
  }

  // Upload_Task_Files
  @Auth(UserRole.User, UserRole.Admin)
  @Post('upload/:taskIndex')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Task_파일 업로드',
    description: '파일 업로드 API',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // Field_Name_Match ->> FilesInterceptor('files')
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Response Sucess',
    type: TaskBoardsSucessResponse,
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found: You do not have permission to view this post - Number',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Unexpected field',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
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
