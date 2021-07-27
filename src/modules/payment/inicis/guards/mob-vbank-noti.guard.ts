import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as requestIp from 'request-ip';

import { NotFromInicisException } from '../exceptions';

const WHITE_LIST = ['118.129.210.25', '183.109.71.153', '203.238.37.15'];

@Injectable()
export class MobVbankNotiGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = requestIp.getClientIp(request);

    if (!WHITE_LIST.includes(ip)) {
      throw new NotFromInicisException('모바일이니시스 가상계좌 입금통보');
    }

    return true;
  }
}
