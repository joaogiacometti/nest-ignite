import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';

describe('Auth account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  test(`[POST] sessions`, async () => {
    await prisma.user.create({
      data: {
        name: 'test',
        email: 'test@gmail.com',
        password: await hash('123456', 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'test@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
