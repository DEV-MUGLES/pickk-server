import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Query } from '@nestjs/graphql';

import { UsersService } from '@src/modules/user/users/users.service';
import { checkIsPermitted } from '@src/modules/user/users/helpers/user-role.helper';
import { AuthService } from './auth.service';

import { CurrentUser } from './decorators/current-user.decorator';
import { LoginByCodeInput } from './dto/login.input';
import { JwtPayload, JwtToken } from './dto/jwt.dto';
import { ForbiddenResourceException } from './exceptions/user.exception';
import { JwtRefreshGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(AuthService) private authService: AuthService
  ) {}

  @Query(() => JwtToken, {
    description: 'refresh token을 받아서 새로운 JwtToken을 생성합니다.',
  })
  @UseGuards(JwtRefreshGuard)
  async refreshJwtToken(@CurrentUser() payload: JwtPayload) {
    const user = await this.usersService.get(payload.sub);
    return this.authService.getToken(user);
  }

  @Query(() => JwtToken)
  async loginByCode(
    @Args('loginByCodeInput') loginByCodeInput: LoginByCodeInput
  ) {
    const { code, password, minRole } = loginByCodeInput;
    const user = await this.authService.getUserByCodeAuth(code, password);
    if (!checkIsPermitted(user.role, minRole)) {
      throw new ForbiddenResourceException(minRole);
    }
    return this.authService.getToken(user);
  }
}
