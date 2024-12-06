import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { Token } from 'src/schemas/token';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { z } from 'zod';

const requestSchema = z.object({
  title: z.string(),
  content: z.string(),
  slug: z.string(),
});

const requestPipe = new ZodValidationPipe(requestSchema);

type Request = z.infer<typeof requestSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async Handle(@Body(requestPipe) body: Request, @CurrentUser() user: Token) {
    const { title, content, slug } = body;
    const userId = user.sub;

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });
  }
}
