import { Test, TestingModule } from '@nestjs/testing';
import { TaskBoardsService } from './2.service';

describe('TaskBoardsService', () => {
  let service: TaskBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskBoardsService],
    }).compile();

    service = module.get<TaskBoardsService>(TaskBoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
