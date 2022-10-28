import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersEntity } from 'src/users/entities/users.entity';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext): UsersEntity => {
    const request = context.switchToHttp().getRequest();
    // console.log('current-user', request.user);
    if (request.user) return request.user;
    else null;
  },
);
