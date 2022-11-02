import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Users-Controller E2E TEST', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    // Test 수행 전, DB synchronize로 DB 초기화
    await app.get(DataSource).synchronize(true);
    await app.init();
  });

  // Authentication
  // it('should login', () => {
  //   return request(app.getHttpServer()).post('/users/signin').send({
  //     email: 'testingEmail@google.com',
  //     password: 'testingPassword123',
  //   });
  // });

  // SignUp_User
  it('Post: SignUp_Success', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/signup')
      .send({
        username: 'testingUser',
        email: 'testingEmail@google.com',
        password: 'testingPassword123',
        role: 'admin',
      });
    // console.log(result);
    expect(result.statusCode).toBe(201);
    expect(result.body.success).toBe(true);
  });
  it('Post: SignUp_Failed', async () => {
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
  it('Post: SignIn_Success', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email: 'testingEmail@google.com',
        password: 'testingPassword123',
      });
    // console.log(result);
    // console.log(result.body.data.access_token);
    // const accessToken = result.body.data.access_token;
    // console.log(accessToken);
    expect(result.statusCode).toBe(201);
    expect(result.body.success).toBe(true);
  });
  it('Post: SignIn_Failed', async () => {
    const result = await request(app.getHttpServer())
      .post('/users/signin')
      .send({ email: 'vxsets11@google.com' });
    // console.log(result);
    expect(result.statusCode).toBe(400);
    expect(result.body.message).toStrictEqual([
      'Please enter a valid password',
    ]);
    expect(result.body.error).toBe('Bad Request');
  });

  // Find_User

  // Find_All_User
  it('GET: Find_All_User_Success', async () => {
    const userInfo = await request(app.getHttpServer())
      .post('/users/signin')
      .send({
        email: 'testingEmail@google.com',
        password: 'testingPassword123',
      });
    // console.log(token.body.data.access_token);
    const accessToken = userInfo.body.data.access_token;
    // console.log(accessToken);

    const result = await request(app.getHttpServer())
      .get('/users?page=1&pageSize=5')
      .set('Authorization', `Bearer ${accessToken}`);
    // console.log(result);
    expect(result.statusCode).toBe(200);
  });
  it('GET: Find_All_User_Failed', async () => {
    const result = await request(app.getHttpServer()).get('/users');
    // console.log(result);
    expect(result.statusCode).toBe(401);
    expect(result.body.message).toStrictEqual('Unauthorized');
  });

  // Update_User

  // Remove_User

  // Test 수행 후, DB synchronize로 DB 초기화
  // afterAll(async () => {
  //   await app.get(DataSource).synchronize(true);
  // });
});
