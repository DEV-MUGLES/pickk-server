import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { extractJwtPayload } from '../helpers';

import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class JwtOrNotGuard extends GqlAuthGuard('verify') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = this.getRequest(context);

    try {
      const payload = extractJwtPayload(req.headers.authorization);
      if (payload.isExpired) {
        throw new UnauthorizedException('만료된 토큰입니다');
      }

      req.user = payload;
    } catch (err) {
      req.user = null;
    }

    return true;
  }
}
