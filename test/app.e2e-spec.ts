import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App-Controller E2E TEST', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Main', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello, Task_Board In NestJS~!');
    });
  });
});
