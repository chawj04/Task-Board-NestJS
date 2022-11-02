import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersEntity } from '../users/entities/users.entity';
import { UsersModule } from '../users/users.module';
import { TaskBoardsEntity } from './entities/tasks.entity';
import { TaskBoardsModule } from './task-boards.module';
import { TaskBoardsService } from './task-boards.service';

describe('TaskBoardsService', () => {
  let service: TaskBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'dev' ? '.env' : '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [UsersEntity, TaskBoardsEntity],
          synchronize: true,
          timezone: 'Z',
        }),
        UsersModule,
        AuthModule,
        TaskBoardsModule,
      ],
    }).compile();

    service = module.get<TaskBoardsService>(TaskBoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
