import {
  BadRequestException,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Args, Query } from '@nestjs/graphql';

import { checkIsPermitted } from '@user/users/helpers';
import { UsersService } from '@user/users/users.service';
import { AppleProviderService } from '@providers/apple';
import { SmsService } from '@providers/sens';

import { CurrentUser } from './decorators';
import {
  GetAppleAuthCodeInput,
  LoginByCodeInput,
  LoginByOauthInput,
  RequestPinInput,
  CheckPinInput,
} from './dtos';
import { ForbiddenResourceException } from './exceptions';
import { JwtRefreshGuard, JwtVerifyGuard } from './guards';
import { genRandomNickname } from './helpers';
import { JwtPayload, JwtToken } from './models';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private appleService: AppleProviderService,
    private smsService: SmsService
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

  @Query(() => String)
  async getAppleAuthCode(
    @Args('getAppleAuthCodeInput')
    { code, clientType }: GetAppleAuthCodeInput
  ): Promise<string> {
    return await this.appleService.auth(code, clientType);
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

  @Query(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async requestPin(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('requestPinInput') { phoneNumber }: RequestPinInput
  ): Promise<boolean> {
    const existing = await this.usersService.findOne({ phoneNumber });
    if (existing) {
      throw new ConflictException('이미 인증된 번호입니다.');
    }

    const pinCode = await this.authService.createPinCode(userId, phoneNumber);
    await this.smsService.sendPin(phoneNumber, pinCode);

    return true;
  }

  @Query(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async checkPin(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('checkPinInput') { phoneNumber, code }: CheckPinInput
  ): Promise<boolean> {
    const success = await this.authService.checkPinCode(
      userId,
      phoneNumber,
      code
    );

    if (success === false) {
      throw new BadRequestException('인증번호 확인 후 다시 입력해주세요.');
    }

    return true;
  }
}
