import { IsNotEmpty } from 'class-validator';
import { TaskBoardsEntity } from '../entities/tasks.entity';

export class UpdateTaskDto extends TaskBoardsEntity {
  @IsNotEmpty()
  taskName: string;

  @IsNotEmpty()
  description: string;
}
