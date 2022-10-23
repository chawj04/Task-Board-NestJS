import {
  Body,
  Controller,
  Logger,
  Post,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  // UsersController - Logger
  private logger = new Logger('UsersController');

  constructor(private readonly usersService: UsersService) {}

  // SignUp_User
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
  signUp(
    // ValidationPipe - 유효성 Check
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UsersEntity | object> {
    try {
      this.logger.verbose(
        `Created New User - ${JSON.stringify(createUserDto)}`,
      );
      return this.usersService.createUser(createUserDto);
    } catch (error) {
      // Controller_signUp_Error 처리
      this.logger.error(error);
    }
  }

  // SignIn_User
  @Post('signin')
  signIn(
    @Body(ValidationPipe) userLoginDto: UserLoginDto,
  ): Promise<UsersEntity> {
    return this.usersService.accessUser(userLoginDto);
  }

  // Find_User
  @Get(':userIndex')
  findUser(
    @Param('userIndex', new ParseIntPipe())
    userIndex: number,
  ): Promise<UsersEntity> {
    return this.usersService.getUser(userIndex);
  }

  // Find_All_User
  @Get()
  findAllUser(): Promise<UsersEntity[]> {
    return this.usersService.getUserList();
  }

  // Update_User
  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.usersService.updateUser(updateUserDto);
  }

  // Remove_User
  @Delete(':userIndex')
  remove(
    @Param('userIndex', new ParseIntPipe())
    userIndex: number,
  ): Promise<DeleteResult> {
    return this.usersService.remove(userIndex);
  }
}
