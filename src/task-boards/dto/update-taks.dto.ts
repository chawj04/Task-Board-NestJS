import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TaskBoardsEntity } from '../entities/tasks.entity';

export class UpdateTaskDto extends OmitType(TaskBoardsEntity, [
  'taskIndex',
  'userIdx',
  'createdAt',
] as const) {
  @IsNotEmpty()
  taskName: string;

  @IsNotEmpty()
  description: string;
}
