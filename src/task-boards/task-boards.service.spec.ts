import { Test, TestingModule } from '@nestjs/testing';
import { TaskBoardsService } from './task-boards.service';

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
