import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create account (E2E)', () => {
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

  test(`[POST] accounts`, async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'test@gmail.com' },
    });

    expect(userOnDatabase).not.toBeNull();
  });
});
