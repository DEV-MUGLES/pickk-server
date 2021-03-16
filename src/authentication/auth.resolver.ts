import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';

import { UsersService } from '@src/modules/user/users/users.service';
import { AuthService } from './auth.service';

import { CurrentUser } from './decorators/current-user.decorator';
import { LoginByCodeInput, LoginByEmailInput } from './dto/login.input';
import { JwtPayload, JwtToken } from './dto/jwt.dto';
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

  @Mutation(() => JwtToken)
  async loginByEmail(
    @Args('loginByEmailInput') loginByEmailInput: LoginByEmailInput
  ) {
    const { email, password } = loginByEmailInput;
    const user = await this.authService.getUserByEmailAuth(email, password);
    return this.authService.getToken(user);
  }

  @Mutation(() => JwtToken)
  async loginByCode(
    @Args('loginByCodeInput') loginByCodeInput: LoginByCodeInput
  ) {
    const { code, password } = loginByCodeInput;
    const user = await this.authService.getUserByCodeAuth(code, password);
    return this.authService.getToken(user);
  }
}
