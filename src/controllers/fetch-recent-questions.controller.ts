import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

const querySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

type Query = z.infer<typeof querySchema>;

const queryPipe = new ZodValidationPipe(querySchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async Handle(@Query('page', queryPipe) page: Query) {
    const itemsPerPage = 2;

    const questions = await this.prisma.question.findMany({
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return questions;
  }
}
