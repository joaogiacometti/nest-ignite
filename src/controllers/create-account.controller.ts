import { ConflictException, UsePipes } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type createAccountBodySchemaType = z.infer<typeof createAccountBodySchema>;

@Controller('/account')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: createAccountBodySchemaType) {
    const { name, email, password } = body;

    const userWithDuplicatedEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userWithDuplicatedEmail)
      throw new ConflictException('Email already registered');

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
