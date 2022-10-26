import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-taks.dto';
import { TaskBoardsEntity } from './entities/tasks.entity';

@Injectable()
export class TaskBoardsService {
  constructor(private dataSource: DataSource) {}

  // Insert_New_Task
  async insertNewTask(createTaskDto: CreateTaskDto): Promise<InsertResult> {
    const { taskName, description } = createTaskDto;
    const createdTask = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(TaskBoardsEntity)
      .values({ taskName, description })
      .execute();

    return createdTask;
  }

  // Get_Task
  async getTask(taskIndex: number): Promise<TaskBoardsEntity> {
    return await this.dataSource
      .getRepository(TaskBoardsEntity)
      .createQueryBuilder('task')
      .where('task.taskIndex = :taskIndex', { taskIndex })
      .getOne();
  }

  // Get_Task_List
  async getTaskList(): Promise<TaskBoardsEntity[]> {
    return await this.dataSource
      .getRepository(TaskBoardsEntity)
      .createQueryBuilder('task')
      .getMany();
  }

  // Edit_Task
  async editTask(
    taskIndex: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateResult> {
    const { taskName, description } = updateTaskDto;
    const editedTask = await this.dataSource
      .createQueryBuilder()
      .update(TaskBoardsEntity)
      .set({ taskName, description })
      .where('taskIndex = :taskIndex', { taskIndex })
      .execute();

    return editedTask;
  }

  // Delete_User
  async removeTask(taskIndex: number): Promise<DeleteResult> {
    const removedTask = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(TaskBoardsEntity)
      .where('taskIndex = :taskIndex', { taskIndex })
      .execute();

    return removedTask;
  }
}
