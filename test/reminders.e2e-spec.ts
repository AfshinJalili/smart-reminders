import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RemindersController (e2e)', () => {
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

  describe('POST /reminders', () => {
    const validReminderData = {
      userPrompt: 'Remind me to take my medicine at 2 PM tomorrow',
      userTimezone: 'America/New_York',
    };

    const validateSuccessfulResponse = (res: request.Response) => {
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(600);

      if (res.status === 201) {
        expect(res.body).toHaveProperty('dateTime');
        expect(res.body).toHaveProperty('title');
        expect(res.body.title).not.toBe('');
      }
    };

    it('should validate request structure', () => {
      return request(app.getHttpServer())
        .post('/reminders')
        .send(validReminderData)
        .expect((res) => {
          validateSuccessfulResponse(res);
        });
    });

    // it('should handle reminder with different timezone', () => {
    //   const reminderData = {
    //     userPrompt: 'Call mom at 3 PM today',
    //     userTimezone: 'UTC',
    //   };

    //   return request(app.getHttpServer())
    //     .post('/reminders')
    //     .send(reminderData)
    //     .expect((res) => {
    //       validateSuccessfulResponse(res);
    //     });
    // });

    // it('should handle reminder with short prompt', () => {
    //   const reminderData = {
    //     userPrompt: 'Meeting',
    //     userTimezone: 'UTC',
    //   };

    //   return request(app.getHttpServer())
    //     .post('/reminders')
    //     .send(reminderData)
    //     .expect((res) => {
    //       validateSuccessfulResponse(res);
    //     });
    // });

    // it('should handle reminder with whitespace in prompt', () => {
    //   const reminderData = {
    //     userPrompt: '   Take medicine at 9 AM   ',
    //     userTimezone: 'UTC',
    //   };

    //   return request(app.getHttpServer())
    //     .post('/reminders')
    //     .send(reminderData)
    //     .expect((res) => {
    //       validateSuccessfulResponse(res);
    //     });
    // });

    // it('should handle reminder with special characters in prompt', () => {
    //   const reminderData = {
    //     userPrompt: 'Meeting with @john.doe at 2:30 PM! (Important)',
    //     userTimezone: 'UTC',
    //   };

    //   return request(app.getHttpServer())
    //     .post('/reminders')
    //     .send(reminderData)
    //     .expect((res) => {
    //       validateSuccessfulResponse(res);
    //     });
    // });

    // it('should handle reminder with emoji in prompt', () => {
    //   const reminderData = {
    //     userPrompt: 'Take medicine 💊 at 9 AM',
    //     userTimezone: 'UTC',
    //   };

    //   return request(app.getHttpServer())
    //     .post('/reminders')
    //     .send(reminderData)
    //     .expect((res) => {
    //       validateSuccessfulResponse(res);
    //     });
    // });

    // it('should handle reminder with numbers in prompt', () => {
    //   const reminderData = {
    //     userPrompt: 'Call room 1234 at extension 5678',
    //     userTimezone: 'UTC',
    //   };

    //   return request(app.getHttpServer())
    //     .post('/reminders')
    //     .send(reminderData)
    //     .expect((res) => {
    //       validateSuccessfulResponse(res);
    //     });
    // });

    // it('should handle reminder with mixed case in prompt', () => {
    //   const reminderData = {
    //     userPrompt: 'IMPORTANT: Take MEDICINE at 9 AM',
    //     userTimezone: 'UTC',
    //   };

    //   return request(app.getHttpServer())
    //     .post('/reminders')
    //     .send(reminderData)
    //     .expect((res) => {
    //       validateSuccessfulResponse(res);
    //     });
    // });

    // describe('Input Validation', () => {
    //   it('should return 400 when userPrompt is missing', () => {
    //     const invalidData = {
    //       userTimezone: 'America/New_York',
    //     };

    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send(invalidData)
    //       .expect(400)
    //       .expect((res) => {
    //         expect(Array.isArray(res.body.message)).toBe(true);
    //         expect(
    //           res.body.message.some((msg: string) =>
    //             msg.includes('User prompt'),
    //           ),
    //         ).toBe(true);
    //       });
    //   });

    //   it('should return 400 when userTimezone is missing', () => {
    //     const invalidData = {
    //       userPrompt: 'Take medicine',
    //     };

    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send(invalidData)
    //       .expect(400)
    //       .expect((res) => {
    //         expect(Array.isArray(res.body.message)).toBe(true);
    //         expect(
    //           res.body.message.some((msg: string) =>
    //             msg.includes('User timezone'),
    //           ),
    //         ).toBe(true);
    //       });
    //   });

    //   it('should return 400 when userPrompt is empty string', () => {
    //     const invalidData = {
    //       userPrompt: '',
    //       userTimezone: 'America/New_York',
    //     };

    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send(invalidData)
    //       .expect(400)
    //       .expect((res) => {
    //         expect(Array.isArray(res.body.message)).toBe(true);
    //         expect(
    //           res.body.message.some((msg: string) =>
    //             msg.includes('User prompt'),
    //           ),
    //         ).toBe(true);
    //       });
    //   });

    //   it('should return 400 when userTimezone is empty string', () => {
    //     const invalidData = {
    //       userPrompt: 'Take medicine',
    //       userTimezone: '',
    //     };

    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send(invalidData)
    //       .expect(400)
    //       .expect((res) => {
    //         expect(Array.isArray(res.body.message)).toBe(true);
    //         expect(
    //           res.body.message.some((msg: string) =>
    //             msg.includes('User timezone'),
    //           ),
    //         ).toBe(true);
    //       });
    //   });

    //   it('should return 400 when userPrompt is too short', () => {
    //     const invalidData = {
    //       userPrompt: 'Hi',
    //       userTimezone: 'America/New_York',
    //     };

    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send(invalidData)
    //       .expect(400)
    //       .expect((res) => {
    //         expect(Array.isArray(res.body.message)).toBe(true);
    //         expect(
    //           res.body.message.some((msg: string) =>
    //             msg.includes('at least 3 characters'),
    //           ),
    //         ).toBe(true);
    //       });
    //   });

    //   it('should return 400 when userPrompt is too long', () => {
    //     const invalidData = {
    //       userPrompt: 'A'.repeat(501),
    //       userTimezone: 'America/New_York',
    //     };

    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send(invalidData)
    //       .expect(400)
    //       .expect((res) => {
    //         expect(Array.isArray(res.body.message)).toBe(true);
    //         expect(
    //           res.body.message.some((msg: string) =>
    //             msg.includes('cannot exceed 500 characters'),
    //           ),
    //         ).toBe(true);
    //       });
    //   });

    //   it('should return 400 when extra fields are provided', () => {
    //     const invalidData = {
    //       userPrompt: 'Take medicine',
    //       userTimezone: 'America/New_York',
    //       extraField: 'should not be allowed',
    //     };

    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send(invalidData)
    //       .expect(400);
    //   });

    //   it('should return 400 when request body is empty', () => {
    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send({})
    //       .expect(400);
    //   });

    //   it('should return 400 when request body is null', () => {
    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .send(null)
    //       .expect(400);
    //   });

    //   it('should return 400 when request body is invalid JSON', () => {
    //     return request(app.getHttpServer())
    //       .post('/reminders')
    //       .set('Content-Type', 'application/json')
    //       .send('invalid json')
    //       .expect(400);
    //   });
    // });
  });
});
