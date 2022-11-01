import { ApiProperty } from '@nestjs/swagger';
import { TaskBoardsEntity } from '../entities/tasks.entity';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

// Task_Boards_Response_DTO
export class TaskBoardsResponseDto extends TaskBoardsEntity {
  @ApiProperty({
    example: '2022-10-23T06:04:38.570Z',
    description: 'updatedAt',
  })
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description: 'filesUrl',
    required: true,
  })
  filesUrl: string;
}

// Swagger_Task_Boards_Response
export class TaskBoardsResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: TaskBoardsResponseDto;
}

// Swagger_Task_Boards_Success_Response
export class TaskBoardsSucessResponse {
  @ApiProperty()
  success: boolean;
}

// Swagger_Find_ALL_Query_Pagination
export class PaginationQuery {
  @ApiProperty({
    name: 'page',
    required: true,
    description: 'Page Number',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({
    name: 'pageSize',
    required: true,
    description: 'Page Size ',
    example: 5,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  pageSize: number;
}
