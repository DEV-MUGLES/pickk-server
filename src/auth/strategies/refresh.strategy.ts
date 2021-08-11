import { Injectable } from '@nestjs/common';

import { jwtRefreshConstants } from '../constants';
import { JwtPayload } from '../models';

import { BaseStrategy } from './base.strategy';

@Injectable()
export class RefreshStrategy extends BaseStrategy(
  'refresh',
  jwtRefreshConstants.secret
) {
  constructor() {
    super();
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
