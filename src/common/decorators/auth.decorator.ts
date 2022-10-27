import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/users/entities/users.entity';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from './role.decorator';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(Role(...roles), UseGuards(JwtAuthGuard, RolesGuard));
}
