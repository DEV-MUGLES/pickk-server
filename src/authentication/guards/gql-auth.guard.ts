import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export const GqlAuthGuard = (type?: string | string[]) => {
  return class ResultGuard extends AuthGuard(type) {
    getRequest(context: ExecutionContext) {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }
  };
};
