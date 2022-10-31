import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { Auth } from '../common/decorators/auth.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRole, UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import { SuccessInterceptor } from '../common/interceptors/success.interceptor';
import {
  PaginationQuery,
  UserResponse,
  UserSucessResponse,
} from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(new SuccessInterceptor())
export class UsersController {
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
  @ApiCreatedResponse({
    status: 201,
    description: 'Response Sucess',
    type: UserResponse,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Your email address is already in our database',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  signUp(
    // ValidationPipe - 유효성 Check
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UsersEntity | object> {
    return this.usersService.createUser(createUserDto);
  }

  // SignIn_User
  @Post('signin')
  @ApiOperation({
    summary: 'User_로그인',
    description: '로그인 API',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Response Sucess',
    type: UserSucessResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Please enter a valid password & email',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async signIn(
    @Body(ValidationPipe) userLoginDto: UserLoginDto,
  ): Promise<UsersEntity | object> {
    const signInUser = await this.usersService.accessUser(userLoginDto);
    return this.authService.login(signInUser);
  }

  // Find_User
  @Auth(UserRole.User, UserRole.Admin)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'User_회원 정보 조회',
    description: '회원 정보 조회 API',
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'Response Sucess',
    type: UserResponse,
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found: There is no user record corresponding to this userIndex - Number',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get(':userIndex')
  findUser(
    @Param('userIndex', new ParseIntPipe())
    userIndex: number,
  ): Promise<UsersEntity> {
    return this.usersService.getUser(+userIndex);
  }

  // Find_All_User
  @Auth(UserRole.Admin)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'User_회원 정보 전체 조회',
    description: '회원 정보 전체 조회 API',
  })
  @ApiResponse({
    status: 200,
    isArray: true,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            anyOf: [
              { $ref: getSchemaPath(UserResponse) },
              { $ref: getSchemaPath(UserResponse) },
              { $ref: getSchemaPath(UserResponse) },
              { $ref: getSchemaPath(UserResponse) },
              { $ref: getSchemaPath(UserResponse) },
              { $ref: getSchemaPath(UserResponse) },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  findAllUser(@Query() query: PaginationQuery): Promise<UsersEntity[]> {
    return this.usersService.getUserList(query.page, query.pageSize);
  }

  // Update_User
  @Auth(UserRole.User, UserRole.Admin)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'User_회원 정보 수정',
    description: '회원 정보 수정 API',
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'Response Sucess',
    type: UserSucessResponse,
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found: There is no user record corresponding to this userIndex - Number',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'User_회원 정보 삭제',
    description: '회원 정보 삭제 API',
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'Response Sucess',
    type: UserSucessResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description:
      'Not Found: There is no user record corresponding to this userIndex - Number',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Delete(':userIndex')
  remove(
    @Param('userIndex', new ParseIntPipe())
    userIndex: number,
  ): Promise<DeleteResult> {
    return this.usersService.remove(+userIndex);
  }
}
