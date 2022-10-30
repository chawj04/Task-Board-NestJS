import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private dataSource: DataSource,
  ) {}

  // User_SignUp
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UsersEntity | object> {
    const { username, email, password, role } = createUserDto;

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
    user.role = role;

    // Exist_Email_Error
    const existEmail = await this.userRepository.findOneBy({ email });
    if (existEmail)
      throw new ConflictException(
        'Your email address is already in our database',
      );

    await this.userRepository.save(user);

    // Response Filtering
    return {
      username: user.username,
      email: user.email,
      userIndex: user.userIndex,
      createdAt: user.createdAt,
      role: user.role,
    };
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

    const signInUser = await this.dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.password = :password', { password: hash })
      .getOne();

    // Email & Password
    const validEmail = await this.userRepository.findOneBy({ email });
    const validPassword = await this.userRepository.findOneBy({ password });
    if (!validEmail || !validPassword)
      throw new ConflictException(
        'Please enter a valid login email and password',
      );

    return signInUser;
  }

  // Get_User
  async getUser(userIndex: number): Promise<UsersEntity> {
    const foundUser = await this.dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .where('user.userIndex = :userIndex', { userIndex })
      .getOne();

    if (!foundUser) {
      throw new NotFoundException(
        `There is no user record corresponding to this userIndex- ${userIndex}`,
      );
    }
    return foundUser;
  }

  // Get_User_List
  async getUserList(): Promise<UsersEntity[]> {
    return await this.dataSource
      .getRepository(UsersEntity)
      .createQueryBuilder('user')
      .getMany();
  }

  // Edit_User
  async updateUser(
    userIndex: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const { email, username, role, password, updatedAt } = updateUserDto;

    // password 수정 시 - 다시 암호화
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const updatedUser = await this.dataSource
      .createQueryBuilder()
      .update(UsersEntity)
      .set({ email, username, role, password: hash, salt, updatedAt })
      .where('userIndex = :userIndex', { userIndex })
      .execute();

    if (updatedUser.affected === 0) {
      throw new NotFoundException(
        `There is no user record corresponding to this userIndex - ${userIndex}`,
      );
    }
    return updatedUser;
  }

  // Delete_User
  async remove(userIndex: number): Promise<DeleteResult> {
    const deletedUser = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(UsersEntity)
      .where('userIndex = :userIndex', { userIndex })
      .execute();

    if (deletedUser.affected === 0) {
      throw new NotFoundException(
        `There is no user record corresponding to this userIndex - ${userIndex}`,
      );
    }
    return deletedUser;
  }
}
