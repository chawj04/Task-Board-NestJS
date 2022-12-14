import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/users.entity';

export const ROLES_KEY = 'roles';

export const Role = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
