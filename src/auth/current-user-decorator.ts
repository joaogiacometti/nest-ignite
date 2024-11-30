import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Token } from 'src/schemas/token';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as Token;
  },
);
