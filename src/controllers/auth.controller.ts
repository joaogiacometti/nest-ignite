import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';
import { compare } from 'bcryptjs';

const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthBodySchema = z.infer<typeof authBodySchema>;

@Controller('sessions')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async Handle(@Body() body: AuthBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user)
      return new UnauthorizedException('User credentials do not match');

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      return new UnauthorizedException('User credentials do not match');

    const accessToken = this.jwt.sign({
      sub: user.id,
    });

    return {
      access_token: accessToken,
    };
  }
}