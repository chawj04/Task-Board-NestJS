import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Task-Boards-Controller E2E TEST', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  // Test 수행 후, DB synchronize로 DB 초기화
  afterAll(async () => {
    await app.get(DataSource).synchronize(true);
  });

  // Login_User_AccessToken
  let accessToken: string; // 상위 Scope -> accessToken 변수 저장
  it('POST: Login_User_AccessToken', async () => {
    await request(app.getHttpServer()).post('/users/signup').send({
      username: 'testUser',
      email: 'testEmail@google.com',
      password: 'testPassword123',
      role: 'admin',
    });
    const loginUser = await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email: 'testEmail@google.com',
        password: 'testPassword123',
      });
    accessToken = loginUser.body.data.access_token;
  });

  // Regist_NewTask
  it('POST: Regist_New_Task_Success', async () => {
    const result = await request(app.getHttpServer())
      .post('/task-boards/regist')
      .send({
        taskName: 'taskTest',
        description: 'TaskTestDescription',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(201);
    expect(result.body.success).toBe(true);
  });
  it('POST: Regist_New_Task_Bad_Request_Failed', async () => {
    const result = await request(app.getHttpServer())
      .post('/task-boards/regist')
      .send({
        taskName: 'taskTest',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toStrictEqual([
      'description should not be empty',
    ]);
  });
  it('POST: Regist_New_Task_Unauthorized_Failed', async () => {
    const result = await request(app.getHttpServer())
      .post('/task-boards/regist')
      .send({
        taskName: 'taskTest',
        description: 'TaskTestDescription',
      });
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });

  // Find_Task
  it('GET: Find_Task_Success', async () => {
    const result = await request(app.getHttpServer())
      .get('/task-boards/1')
      .set('Authorization', `Bearer ${accessToken}`);
    console.log(result);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  // Find_All_Task
  // Update_Task
  // Remove_Task
});
