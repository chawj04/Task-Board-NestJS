import { ApiProperty, PickType } from '@nestjs/swagger';
import { UsersEntity } from '../entities/users.entity';

// Create_User_Response
export class CreateUserResponseDto extends PickType(UsersEntity, [
  'email',
  'username',
  'createdAt',
] as const) {
  @ApiProperty({
    example: '33',
    description: 'userIndex',
    required: true,
  })
  readonly userIndex: number;

  @ApiProperty({
    example: '2022-10-23T06:04:38.570Z',
    description: 'createdAt',
  })
  readonly createdAt: Date;
}
