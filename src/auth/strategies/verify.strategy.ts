import { Injectable } from '@nestjs/common';

import { JwtPayload } from '../models';

import { BaseStrategy } from './base.strategy';

@Injectable()
export class VerifyStrategy extends BaseStrategy('verify') {
  async validate(payload: JwtPayload) {
    return payload;
  }
}
