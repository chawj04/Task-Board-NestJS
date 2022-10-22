import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  // UsersController - Logger
  private logger = new Logger('UsersController');

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
    description: 'Response Success..',
    type: CreateUserResponseDto,
  })
  signUp(@Body() createUserDto: CreateUserDto): Promise<UsersEntity | object> {
    // CreateUser - Logger
    this.logger.verbose(`Created New User - ${JSON.stringify(createUserDto)}`);
    return this.usersService.createUser(createUserDto);
  }
}
