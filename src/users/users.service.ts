import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private dataSource: DataSource,
  ) {}

  // User_SignUp
  async createUser(createUserDto: CreateUserDto): Promise<UsersEntity | void> {
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

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      // console.log(error.errno);
      // 이메일 중복 에러 처리
      if (error.errno === 1062) {
        throw new ConflictException(
          'Your email address is already in our database',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
