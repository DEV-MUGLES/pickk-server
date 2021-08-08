import { Injectable } from '@nestjs/common';

import { UsersService } from '@user/users/users.service';

import { JwtPayload } from '../models';

import { BaseStrategy } from './base.strategy';

@Injectable()
export class LocalStrategy extends BaseStrategy() {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(payload: JwtPayload) {
    return this.usersService.get(payload.sub);
  }
}
