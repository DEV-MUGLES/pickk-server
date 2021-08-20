import { ExecutionContext, Injectable } from '@nestjs/common';

import { GqlAuthGuard } from './gql-auth.guard';

const parse = (input: string): string =>
  Buffer.from(input, 'base64').toString();

@Injectable()
export class JwtOrIpGuard extends GqlAuthGuard('verify') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = this.getRequest(context);

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw new Error();
      }

      const payload = JSON.parse(
        parse(req.headers.authorization.split('.')[1])
      );
      req.user = payload;
    } catch {
      if (req.headers['x-forwarded-for']) {
        req.user = req.headers['x-forwarded-for'].split(',')[0];
      } else {
        req.user = req.connection.remoteAddress;
      }
    }

    return true;
  }
}
