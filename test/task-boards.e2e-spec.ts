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

  // Test 수행 후, synchronize로 DB 초기화
  afterAll(async () => {
    await app.get(DataSource).synchronize(true);
  });

  // Login_User_AccessToken
  let accessToken: string; // 상위 Scope -> accessToken 변수 저장
  it('POST: Login_User - AccessToken', async () => {
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
  it('POST: Regist_New_Task - Success', async () => {
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
  it('POST: Regist_New_Task - Bad_Request', async () => {
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
  it('POST: Regist_New_Task - Unauthorized', async () => {
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
  it('GET: Find_Task - Success', async () => {
    const result = await request(app.getHttpServer())
      .get('/task-boards/task-info/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it('GET: Find_Task - Not_Found', async () => {
    const result = await request(app.getHttpServer())
      .get('/task-boards/task-info/33')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(404);
    expect(result.body.message).toStrictEqual(
      'You do not have permission to view this post - 33',
    );
  });

  // Find_All_Task
  it('GET: Find_All_Task - Success', async () => {
    const result = await request(app.getHttpServer())
      .get('/task-boards?page=1&pageSize=5')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it('GET: Find_All_Task - Unauthorized', async () => {
    const result = await request(app.getHttpServer()).get(
      '/task-boards?page=1&pageSize=5',
    );
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });

  // Update_Task
  it('PATCH: Update_Task - Success', async () => {
    const result = await request(app.getHttpServer())
      .patch('/task-boards/task-info/1')
      .send({
        taskName: 'taskTest9999',
        description: 'TaskTestDescription9999',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it('PATCH: Update_Task - Unauthorized', async () => {
    const result = await request(app.getHttpServer())
      .patch('/task-boards/task-info/1')
      .send({
        taskName: 'taskTest9999',
        description: 'TaskTestDescription9999',
      });
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });
  it('PATCH: Update_Task - Not_Found', async () => {
    const result = await request(app.getHttpServer())
      .patch('/task-boards/task-info/134')
      .send({
        taskName: 'taskTest9999',
        description: 'TaskTestDescription9999',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(404);
    expect(result.body.message).toStrictEqual(
      'You do not have permission to edit this post - 134',
    );
  });

  // Remove_Task
  it('DELETE: Remove_Task - Success', async () => {
    const result = await request(app.getHttpServer())
      .delete('/task-boards/task-info/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it('DELETE: Remove_Task - Unauthorized', async () => {
    const result = await request(app.getHttpServer()).delete(
      '/task-boards/task-info/1',
    );
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });
  it('DELETE: Remove_Task - Not_Found', async () => {
    const result = await request(app.getHttpServer())
      .delete('/task-boards/task-info/135')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(404);
    expect(result.body.message).toStrictEqual(
      'You do not have permission to delete this post - 135',
    );
  });

  // Upload_Task_Files
  // it('POST: Upload_Task_Files - Success', async () => {
  //   const result = await request(app.getHttpServer())
  //     .post('/task-boards/upload/1')
  //     .set('Authorization', `Bearer ${accessToken}`)
  //     .set('Content-Type', 'multipart/form-data')
  //     .attach('files', '/task/task7667296160650.jpg');
  //   expect(result.statusCode).toBe(201);
  //   expect(result.body.success).toBe(true);
  // });
});
