import { IsNotEmpty } from 'class-validator';
import { TaskBoardsEntity } from '../entities/tasks.entity';

export class CreateTaskDto extends TaskBoardsEntity {
  @IsNotEmpty()
  taskName: string;

  @IsNotEmpty()
  description: string;

  // @IsNotEmpty()
  // userIdx: number;
}
