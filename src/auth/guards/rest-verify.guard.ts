import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { extractJwtPayload } from '@auth/helpers';

/**
 * 이 가드는 Rest api endpoint(@Controller)에서만 적용되는 가드입니다.
 */
@Injectable()
export class RestVerifyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const payload = extractJwtPayload(req.headers.authorization);
    if (payload.isExpired) {
      throw new UnauthorizedException('만료된 토큰입니다');
    }

    req.user = payload;

    return true;
  }
}
