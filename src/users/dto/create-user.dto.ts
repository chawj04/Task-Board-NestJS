import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { UserRole, UsersEntity } from '../entities/users.entity';

// Create_User_Request
export class CreateUserDto extends OmitType(UsersEntity, [
  'userIndex',
  'createdAt',
  'updatedAt',
] as const) {
  @IsString()
  @IsNotEmpty()
  username: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Use a strong password',
  })
  password: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  role: UserRole;
}
