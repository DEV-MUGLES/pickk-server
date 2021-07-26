import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Args, Query } from '@nestjs/graphql';

import { UserOauthProvider } from '@user/users/constants';
import { checkIsPermitted } from '@user/users/helpers';
import { UsersService } from '@user/users/users.service';
import { AppleProviderService } from '@providers/apple';

import { CurrentUser } from './decorators';
import {
  LoginWithAppleInput,
  LoginByCodeInput,
  LoginByOauthInput,
  JwtPayload,
  JwtToken,
} from './dtos';
import { ForbiddenResourceException } from './exceptions';
import { JwtRefreshGuard } from './guards';
import { genRandomNickname } from './helpers';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(AppleProviderService) private appleService: AppleProviderService
  ) {}

  @Query(() => JwtToken, {
    description: 'refresh token을 받아서 새로운 JwtToken을 생성합니다.',
  })
  @UseGuards(JwtRefreshGuard)
  async refreshJwtToken(@CurrentUser() payload: JwtPayload) {
    const user = await this.usersService.getNicknameOnly(payload.sub);
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

  @Query(() => JwtToken)
  async loginWithApple(
    @Args('getAppleProviderIdInput')
    { code, clientType }: LoginWithAppleInput
  ): Promise<JwtToken> {
    const oauthCode = await this.appleService.auth(code, clientType);
    return await this.loginByOauth({
      oauthProvider: UserOauthProvider.Apple,
      oauthCode,
    });
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

  @Query(() => JwtToken)
  async loginSellerByCode(
    @Args('loginByCodeInput') loginByCodeInput: LoginByCodeInput
  ) {
    const { code, password, minRole } = loginByCodeInput;
    const seller = await this.authService.getSellerByCodeAuth(code, password);
    if (!checkIsPermitted(seller.user.role, minRole)) {
      throw new ForbiddenResourceException(minRole);
    }
    return this.authService.getSellerToken(seller);
  }
}
