import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../users/entities/users.entity';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-taks.dto';
import { UploadFilesDto } from './dto/upload-files.dto';
import { TaskBoardsEntity } from './entities/tasks.entity';

@Injectable()
export class TaskBoardsService {
  constructor(
    @InjectRepository(TaskBoardsEntity)
    private taskBoardsRepository: Repository<TaskBoardsEntity>,
    private dataSource: DataSource,
  ) {}

  // Insert_New_Task
  async insertNewTask(
    createTaskDto: CreateTaskDto,
    currentUser: UsersEntity,
  ): Promise<TaskBoardsEntity> {
    const { taskName, description } = createTaskDto;
    const task = new TaskBoardsEntity();
    task.taskName = taskName;
    task.description = description;
    task.userIdx = currentUser.userIndex;
    const result = await this.taskBoardsRepository.save(task);

    return result;
  }

  // Get_Task
  async getTask(
    taskIndex: number,
    currentUser: UsersEntity,
  ): Promise<TaskBoardsEntity> {
    const foundTask = await this.dataSource
      .getRepository(TaskBoardsEntity)
      .createQueryBuilder('taskBoards')
      .where('taskBoards.taskIndex = :taskIndex', { taskIndex })
      .andWhere('taskBoards.userIdx = :userIndex', {
        userIndex: currentUser.userIndex,
      })
      .getOne();

    if (foundTask) {
      return foundTask;
    } else {
      throw new NotFoundException(
        `You do not have permission to view this post - ${taskIndex}`,
      );
    }
  }

  // Get_Task_List
  async getTaskList(
    currentUser: UsersEntity,
    page,
    pageSize,
  ): Promise<TaskBoardsEntity[]> {
    // console.log(page, pageSize);
    const foundTaskList = await this.dataSource
      .getRepository(TaskBoardsEntity)
      .createQueryBuilder('taskBoards')
      .where('taskBoards.userIdx = :userIndex', {
        userIndex: currentUser.userIndex,
      })
      .take(pageSize)
      .skip((page - 1) * pageSize)
      .getMany();
    return foundTaskList;
  }

  // Edit_Task
  async editTask(
    currentUser: UsersEntity,
    taskIndex: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateResult> {
    const { taskName, description, filesUrl, updatedAt } = updateTaskDto;
    const editedTask = await this.dataSource
      .createQueryBuilder()
      .update(TaskBoardsEntity)
      .set({ taskName, description, filesUrl, updatedAt })
      .where('taskIndex = :taskIndex', { taskIndex })
      .andWhere('userIdx = :userIndex', {
        userIndex: currentUser.userIndex,
      })
      .execute();

    if (editedTask.affected === 0) {
      throw new NotFoundException(
        `You do not have permission to edit this post - ${taskIndex}`,
      );
    }

    return editedTask;
  }

  // Delete_Task
  async deleteTask(
    taskIndex: number,
    currentUser: UsersEntity,
  ): Promise<DeleteResult> {
    const result = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(TaskBoardsEntity)
      .where('taskIndex = :taskIndex', { taskIndex })
      .andWhere('userIdx = :userIndex', {
        userIndex: currentUser.userIndex,
      })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(
        `You do not have permission to delete this post - ${taskIndex}`,
      );
    }
    return result;
  }

  // Upload_File
  async uploadFile(
    currentUser: UsersEntity,
    taskIndex: number,
    uploadFilesDto: UploadFilesDto,
    files: Express.Multer.File[],
  ): Promise<UpdateResult> {
    let { filesUrl } = uploadFilesDto;
    filesUrl = `http://localhost:8888/files/task/${files[0].filename}`;

    const uploadedFilesUrl = await this.dataSource
      .createQueryBuilder()
      .update(TaskBoardsEntity)
      .set({ filesUrl })
      .where('taskIndex = :taskIndex', { taskIndex })
      .andWhere('userIdx = :userIndex', {
        userIndex: currentUser.userIndex,
      })
      .execute();
    // console.log('service', uploadedFilesUrl);

    if (uploadedFilesUrl.affected === 0) {
      throw new NotFoundException(
        `You do not have permission to upload this post - ${taskIndex}`,
      );
    }
    return uploadedFilesUrl;
  }
}
