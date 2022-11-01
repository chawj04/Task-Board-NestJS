import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TaskBoardsEntity } from '../entities/tasks.entity';

export class CreateTaskDto extends OmitType(TaskBoardsEntity, [
  'taskIndex',
  'userIdx',
  'filesUrl',
  'createdAt',
  'updatedAt',
] as const) {
  @IsNotEmpty()
  taskName: string;

  @IsNotEmpty()
  description: string;
}
