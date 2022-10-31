import { OmitType } from '@nestjs/swagger';
import { UsersEntity } from '../entities/users.entity';

// Upadte_User_Dto
export class UpdateUserDto extends OmitType(UsersEntity, [
  'userIndex',
  'createdAt',
] as const) {}
