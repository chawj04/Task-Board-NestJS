import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
  constructor(
    // private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // //의미 없는 코드 됨
  // async validateUser(username: string, password: string): Promise<any> {
  //   const user = await this.usersService.getUser(3);
  //   if (user && user.password === password) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userIndex };
    return {
      access_token: this.jwtService.sign(payload, { secret: jwtConfig.secret }),
    };
  }
}
