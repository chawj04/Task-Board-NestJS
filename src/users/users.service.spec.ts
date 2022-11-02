import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskBoardsModule } from '../task-boards/task-boards.module';
import { AuthModule } from '../auth/auth.module';
import { TaskBoardsEntity } from '../task-boards/entities/tasks.entity';
import { UsersEntity } from './entities/users.entity';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;

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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
