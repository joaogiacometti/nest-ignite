import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

describe('Fetch questions (E2E)', () => {
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

  test(`[GET] questions`, async () => {
    const user = await prisma.user.create({
      data: {
        name: 'test',
        email: 'test@gmail.com',
        password: await hash('123456', 8),
      },
    });

    const access_token = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: 'test',
          content: 'test',
          slug: 'test',
          authorId: user.id,
        },
        {
          title: 'test1',
          content: 'test',
          slug: 'test1',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
