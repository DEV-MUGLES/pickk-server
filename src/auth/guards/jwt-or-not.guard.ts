import { ExecutionContext, Injectable } from '@nestjs/common';

import { extractJwtPayload } from '../helpers';

import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class JwtOrNotGuard extends GqlAuthGuard('verify') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = this.getRequest(context);

    try {
      req.user = extractJwtPayload(req.headers.authorization);
    } catch {
      req.user = null;
    }

    return true;
  }
}
