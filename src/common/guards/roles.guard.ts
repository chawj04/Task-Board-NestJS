import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/users/entities/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // console.log(requiredRoles);

    // Role X -> 인증 X
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    // console.log(user);
    // console.log(requiredRoles.includes(user.roles));

    if (!user) {
      throw new HttpException('No user information', HttpStatus.UNAUTHORIZED);
    }

    // Admin - true
    if (user.role === UserRole.Admin) {
      return true;
    }

    // Check - @Auth(UserRole.User), @Auth(UserRole.Admin)
    if (requiredRoles.includes(user.roles)) {
      return true;
    } else {
      throw new HttpException(
        `You don't have authorization to access this resource`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
