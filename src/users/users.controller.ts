import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // User_SignUp
  @Post('signup')
  @ApiOperation({
    summary: 'User_회원가입',
    description: '회원가입 API',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error..',
  })
  @ApiResponse({
    status: 201,
    description: 'Created Success..',
    type: CreateUserDto,
  })
  signUp(@Body() createUserDto: CreateUserDto): Promise<UsersEntity | void> {
    return this.usersService.createUser(createUserDto);
  }
}
