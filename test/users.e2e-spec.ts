import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Users-Controller E2E TEST', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    // Test 수행 전, DB synchronize로 DB 초기화
    // await app.get(DataSource).synchronize(true);
    await app.init();
  });

  // Test 수행 후, DB synchronize로 DB 초기화
  afterAll(async () => {
    await app.get(DataSource).synchronize(true);
  });

  // SignUp_User
  it('POST: SignUp_Success', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        username: 'testingUser',
        email: 'testingEmail@google.com',
        password: 'testingPassword123',
        role: 'admin',
      });
    expect(result.statusCode).toBe(201);
    expect(result.body.success).toBe(true);
  });
  it('POST: SignUp_Bad_Request_Failed', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        username: 'testingUser',
        email: 'testingEmail@google.com',
        password: 'testingPassword123',
      });
    // console.log(result);
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toStrictEqual(['role should not be empty']);
    expect(result.body.error).toBe('Bad Request');
  });

  // SginIn_User
  let accessToken: string; // 상위 Scope -> accessToken 변수 저장
  it('POST: SignIn_Success', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email: 'testingEmail@google.com',
        password: 'testingPassword123',
      });
    accessToken = result.body.data.access_token;
    expect(result.statusCode).toBe(201);
    expect(result.body.success).toBe(true);
  });
  it('POST: SignIn_Bad_Request_Failed', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/signin')
      .send({ email: 'vxsets11@google.com' });
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toStrictEqual([
      'Please enter a valid password',
    ]);
    expect(result.body.error).toBe('Bad Request');
  });

  // Find_User
  it('GET: Find_User_Success', async () => {
    const result = await request(app.getHttpServer())
      .get('/users/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it('GET: Find_User_Unauthorized_Failed', async () => {
    const result = await request(app.getHttpServer()).get('/users/1');
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });

  // Find_All_User
  it('GET: Find_All_User_Success', async () => {
    const result = await request(app.getHttpServer())
      .get('/users?page=1&pageSize=5')
      .set('Authorization', `Bearer ${accessToken}`);
    // console.log(result);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it('GET: Find_All_User_Unauthorized_Failed', async () => {
    const result = await request(app.getHttpServer()).get(
      '/users?page=1&pageSize=5',
    );
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });

  // Update_User
  it('PATCH: Update_User_Success', async () => {
    const result = await request(app.getHttpServer())
      .patch('/users/1')
      .send({
        username: 'testingUser12',
        email: 'testingEmail12@google.com',
        password: 'testingPassword123',
        role: 'admin',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it('PATCH: Update_User_Unauthorized_Failed', async () => {
    const result = await request(app.getHttpServer()).patch('/users/1').send({
      username: 'testingUser12',
      email: 'testingEmail12@google.com',
      password: 'testingPassword123',
      role: 'admin',
    });
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });
  it('PATCH: Update_User_Not_Found_Failed', async () => {
    const result = await request(app.getHttpServer())
      .patch('/users/2')
      .send({
        username: 'testingUser12',
        email: 'testingEmail12@google.com',
        password: 'testingPassword123',
        role: 'admin',
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(404);
    expect(result.body.message).toStrictEqual(
      'There is no user record corresponding to this userIndex - 2',
    );
  });

  // Remove_User
  it('DELETE: Remove_User_Success', async () => {
    const result = await request(app.getHttpServer())
      .delete('/users/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it('DELETE: Remove_User_Unauthorized_Failed', async () => {
    const result = await request(app.getHttpServer()).delete('/users/1');
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });
  it('DELETE: Remove_User_Not_Found_Failed', async () => {
    const result = await request(app.getHttpServer())
      .delete('/users/1')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.statusCode).toBe(404);
    expect(result.body.message).toStrictEqual(
      'There is no user record corresponding to this userIndex- 1',
    );
  });
});
