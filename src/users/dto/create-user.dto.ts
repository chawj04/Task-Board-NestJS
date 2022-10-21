import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

// Create_User_Request
export class CreateUserDto {
  @ApiProperty({
    example: 'testName1',
    description: 'username',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  readonly username: string;

  @ApiProperty({
    example: 'testEmail@test.com',
    description: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'as123',
    description: 'password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  //유효성 체크
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Accept Only Allow English Characters And Numbers',
  })
  readonly password: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly deletedAt: Date;
}
