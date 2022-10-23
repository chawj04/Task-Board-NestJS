import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  // UsersService - Logger
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private dataSource: DataSource,
  ) {}

  // User_SignUp
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UsersEntity | object> {
    const { username, email, password } = createUserDto;

    // password 암호화
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // user 생성
    const user = new UsersEntity();
    user.username = username;
    user.email = email;
    user.password = hash;
    user.salt = salt;

    try {
      await this.userRepository.save(user);
      this.logger.verbose(
        `Created New User - ${JSON.stringify(createUserDto)}`,
      );
      // Response Filtering
      return {
        username: user.username,
        email: user.email,
        userIndex: user.userIndex,
        createdAt: user.createdAt,
      };
    } catch (error) {
      // Service_signUp_Error 처리
      // console.log(error.errno);
      this.logger.error(error);
      if (error.errno === 1062) {
        throw new ConflictException(
          'Your email address is already in our database',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // User_SignIn
  async accessUser(userLoginDto: UserLoginDto): Promise<UsersEntity> {
    const { email, password } = userLoginDto;
    const accessUser = await this.dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    const { salt } = accessUser;
    const hash = bcrypt.hashSync(password, salt);

    const signInUser = this.dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.password = :password', { password: hash })
      .getOne();

    return signInUser;
  }

  // Get_User
  async getUser(userIndex: number): Promise<UsersEntity> {
    // console.log(userIndex);
    return await this.dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.userIndex = :userIndex', { userIndex })
      .getOne();
  }

  // Get_User_List
  async getUserList(): Promise<UsersEntity[]> {
    return await this.dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .getMany();
  }

  // Edit_User
  async updateUser(updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const { userIndex, email, password, username } = updateUserDto;
    return await this.dataSource
      .createQueryBuilder()
      .update(UsersEntity)
      .set({ email, password, username })
      .where('userIndex = :userIndex', { userIndex })
      .execute();
  }

  // Delete_User
  async remove(userIndex: number): Promise<DeleteResult> {
    return await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(UsersEntity)
      .where('userIndex = :userIndex', { userIndex: userIndex })
      .execute();
  }
}
