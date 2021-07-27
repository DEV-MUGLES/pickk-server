import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as requestIp from 'request-ip';

import { NotFromInicisException } from '../exceptions';

const WHITE_LIST = ['203.238.37.15', '39.115.212.9', '183.109.71'];

@Injectable()
export class StdVbankNotiGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = requestIp.getClientIp(request);

    if (!WHITE_LIST.includes(ip)) {
      throw new NotFromInicisException('PC이니시스 가상계좌 입금통보');
    }

    return true;
  }
}
