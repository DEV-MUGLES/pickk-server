import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { extractJwtPayload } from '../helpers';

import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class JwtOrIpGuard extends GqlAuthGuard('verify') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = this.getRequest(context);

    try {
      const payload = extractJwtPayload(req.headers.authorization);
      if (payload.isExpired) {
        throw new UnauthorizedException('만료된 토큰입니다');
      }

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
