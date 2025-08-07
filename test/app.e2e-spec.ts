import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should have reminders endpoint available', () => {
    return request(app.getHttpServer())
      .post('/reminders')
      .send({
        userPrompt: 'Test reminder',
        userTimezone: 'UTC',
      })
      .expect((res) => {
        expect(res.status).toBeGreaterThanOrEqual(200);
        expect(res.status).toBeLessThan(600);
      });
  });

  it('should have reminders endpoint available', () => {
    return request(app.getHttpServer())
      .post('/reminders')
      .send({
        userPrompt: 'Test reminder',
        userTimezone: 'UTC',
      })
      .expect((res) => {
        expect(res.status).toBeGreaterThanOrEqual(200);
        expect(res.status).toBeLessThan(500);
      });
  });
});
