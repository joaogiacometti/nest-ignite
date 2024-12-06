import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

describe('Create questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test(`[POST] questions`, async () => {
    const user = await prisma.user.create({
      data: {
        name: 'test',
        email: 'test@gmail.com',
        password: await hash('123456', 8),
      },
    });

    const access_token = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title: 'test',
        content: 'test',
        slug: 'test',
      });

    expect(response.status).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'test',
      },
    });

    expect(questionOnDatabase).not.toBeNull();
  });
});
