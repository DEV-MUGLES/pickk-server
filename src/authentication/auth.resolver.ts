import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { UsersService } from '@user/users/users.service';
import { AuthService } from './auth.service';

import { User } from '@src/modules/user/users/models/user.model';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginByCodeInput, LoginByEmailInput } from './dto/login.input';
import { JwtPayload, JwtToken } from './dto/jwt.dto';
import { JwtAuthGuard, JwtVerifyGuard, JwtRefreshGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(AuthService) private authService: AuthService
  ) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => JwtPayload)
  @UseGuards(JwtVerifyGuard)
  getJwtPayload(@CurrentUser() payload: JwtPayload) {
    return payload;
  }

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
    const user = await this.authService.validateEmail(email, password);
    return this.authService.getToken(user);
  }

  @Mutation(() => JwtToken)
  async loginByCode(
    @Args('loginByCodeInput') loginByCodeInput: LoginByCodeInput
  ) {
    const { code, password } = loginByCodeInput;
    const user = await this.authService.validateCode(code, password);
    return this.authService.getToken(user);
  }
}
