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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { Auth } from '../common/decorators/auth.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRole, UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  // UsersController - Logger
  private logger = new Logger('UsersController');

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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
  async signIn(
    @Body(ValidationPipe) userLoginDto: UserLoginDto,
  ): Promise<UsersEntity | object> {
    const sginInUser = await this.usersService.accessUser(userLoginDto);
    // console.log('sginInUser', sginInUser);
    return this.authService.login(sginInUser);
  }

  // Find_User
  @ApiBearerAuth('access-token')
  @Auth(UserRole.User, UserRole.Admin)
  @Get(':userIndex')
  findUser(
    @Param('userIndex', new ParseIntPipe())
    userIndex: number,
  ): Promise<UsersEntity> {
    return this.usersService.getUser(+userIndex);
  }

  // Find_All_User
  @Auth(UserRole.Admin)
  @Get()
  findAllUser(): Promise<UsersEntity[]> {
    return this.usersService.getUserList();
  }

  // Update_User
  @Auth(UserRole.User, UserRole.Admin)
  @Patch(':userIndex')
  updateUser(
    @Param('userIndex', new ParseIntPipe())
    userIndex: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.updateUser(+userIndex, updateUserDto);
  }

  // Remove_User
  @Auth(UserRole.Admin)
  @Delete(':userIndex')
  remove(
    @Param('userIndex', new ParseIntPipe())
    userIndex: number,
  ): Promise<DeleteResult> {
    return this.usersService.remove(+userIndex);
  }
}
