import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation } from '@nestjs/graphql';

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

  @Mutation(() => JwtToken)
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@CurrentUser() payload: JwtPayload) {
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
