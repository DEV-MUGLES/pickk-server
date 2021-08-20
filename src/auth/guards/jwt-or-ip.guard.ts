import { ExecutionContext, Injectable } from '@nestjs/common';

import { extractJwtPayload } from '../helpers';

import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class JwtOrIpGuard extends GqlAuthGuard('verify') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = this.getRequest(context);

    try {
      req.user = extractJwtPayload(req.headers.authorization);
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
