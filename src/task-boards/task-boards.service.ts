import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskBoardsEntity } from './entities/tasks.entity';

@Injectable()
export class TaskBoardsService {
  constructor(
    @InjectRepository(TaskBoardsEntity)
    private taskBoardsRepository: Repository<TaskBoardsEntity>,
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
  // Get_Task_List
  // Edit_Task
  // Delete_User
  //Upload_Task_Files
}
