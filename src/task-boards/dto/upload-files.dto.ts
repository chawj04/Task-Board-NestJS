import { PickType } from '@nestjs/swagger';
import { TaskBoardsEntity } from '../entities/tasks.entity';

export class UploadFilesDto extends PickType(TaskBoardsEntity, [
  'filesUrl',
] as const) {}
