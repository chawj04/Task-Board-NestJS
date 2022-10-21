import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
