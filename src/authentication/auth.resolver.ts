import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Query } from '@nestjs/graphql';

import { UsersService } from '@user/users/users.service';
import { checkIsPermitted } from '@user/users/helpers/user-role.helper';

import { CurrentUser } from './decorators/current-user.decorator';
import { LoginByCodeInput, LoginByOauthInput } from './dto/login.input';
import { JwtPayload, JwtToken } from './dto/jwt.dto';
import { ForbiddenResourceException } from './exceptions/user.exception';
import { JwtRefreshGuard } from './guards';
import { genRandomNickname } from './helpers/auth.helper';
import { AuthService } from './auth.service';

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

  @Query(() => JwtToken)
  async loginByOauth(
    @Args('loginByOauthInput') loginByOauthInput: LoginByOauthInput
  ) {
    const { oauthProvider, oauthCode, minRole } = loginByOauthInput;
    const user = await this.authService.getUserByOauth(
      oauthProvider,
      oauthCode
    );
    if (!checkIsPermitted(user.role, minRole)) {
      throw new ForbiddenResourceException(minRole);
    }
    return this.authService.getToken(user);
  }

  @Query(() => Boolean, {
    description: '중복이면 true, 아니면 false를 반환한다.',
  })
  async checkNicknameDuplicate(
    @Args('nickname') nickname: string
  ): Promise<boolean> {
    return await this.usersService.checkUserExist(nickname);
  }

  @Query(() => String)
  async genRandomNickname(): Promise<string> {
    let nickname: string;
    do {
      nickname = genRandomNickname();
    } while (await this.usersService.checkUserExist(nickname));

    return nickname;
  }
}
