import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import { UsersEntity } from '../entities/users.entity';

// User_Response_DTO
export class UserResponseDto extends OmitType(UsersEntity, [
  'password',
] as const) {}

// Swagger_User_Response
export class UserResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: UserResponseDto;
}

// Swagger_User_Success_Response
export class UserSucessResponse {
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
