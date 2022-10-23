import { IsEmail, IsNotEmpty } from 'class-validator';
import { UsersEntity } from '../entities/users.entity';

// User_Login_Dto
export class UserLoginDto extends UsersEntity {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Please enter a valid password' })
  password: string;
}
