import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { SellersService } from '@item/sellers/sellers.service';
import { UserRole } from '@user/users/constants';
import { User } from '@user/users/models';
import { UsersRepository } from '@user/users/users.repository';
import { UsersService } from '@user/users/users.service';
import { AppleProviderService } from '@providers/apple';

import { LoginByCodeInput } from './dtos';
import * as authHelper from './helpers/auth.helper';
import { JwtPayload, JwtToken } from './models';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { SmsService } from '@providers/sens';

const JWT_TOKEN = 'JWT_TOKEN';
describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            getUserByCodeAuth: jest.fn(),
            getToken: jest.fn(),
          },
        },
        UsersService,
        UsersRepository,
        { provide: SellersService, useValue: {} },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => JWT_TOKEN),
          },
        },
        {
          provide: AppleProviderService,
          useValue: {
            auth: jest.fn(),
          },
        },
        {
          provide: SmsService,
          useValue: {
            sendPin: jest.fn(),
          },
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('refreshJwtToken', () => {
    it('shoud return refreshed JwtToken', async () => {
      const payload: JwtPayload = {
        nickname: faker.lorem.text(),
        sub: faker.datatype.number(),
        iat: new Date().getTime(),
        exp: new Date().getTime(),
      };
      const user = new User({
        id: payload.sub,
        nickname: payload.nickname,
      });
      const token: JwtToken = {
        access: faker.lorem.text(),
        refresh: faker.lorem.text(),
      };

      const usersServiceGetSpy = jest
        .spyOn(usersService, 'getNicknameOnly')
        .mockResolvedValue(user);
      const authServiceGetTokenSpy = jest
        .spyOn(authService, 'getToken')
        .mockReturnValue(token);

      const result = await authResolver.refreshJwtToken(payload);
      expect(result).toEqual(token);
      expect(usersServiceGetSpy).toHaveBeenCalledWith(payload.sub);
      expect(authServiceGetTokenSpy).toHaveBeenCalledWith(user);
    });
  });

  describe('loginByCode', () => {
    it('should return matching user', async () => {
      const loginByCodeInput: LoginByCodeInput = {
        code: faker.lorem.text(),
        password: faker.lorem.text(),
        minRole: UserRole.Admin,
      };
      const existingUser = new User({
        code: loginByCodeInput.code,
        role: UserRole.Admin,
      });
      const jwtToken: JwtToken = {
        access: JWT_TOKEN,
        refresh: JWT_TOKEN,
      };

      const authServiceGetUserByCodeAuthSpy = jest
        .spyOn(authService, 'getUserByCodeAuth')
        .mockResolvedValue(existingUser);
      const authServiceGetTokenSpy = jest
        .spyOn(authService, 'getToken')
        .mockReturnValue(jwtToken);

      const result = await authResolver.loginByCode(loginByCodeInput);

      expect(result).toEqual(jwtToken);
      expect(authServiceGetUserByCodeAuthSpy).toHaveBeenCalledWith(
        loginByCodeInput.code,
        loginByCodeInput.password
      );
      expect(authServiceGetTokenSpy).toHaveBeenCalledWith(existingUser);
    });
  });

  describe('genRandomNickname', () => {
    it('생성한 닉네임의 유저가 존재하는 경우 반복해서 다시 시도한다.', async () => {
      const count = Math.max(faker.datatype.number(100), 1);
      const NICKNAME = 'nickname';

      const authHelperGenRandomNumberSpy = jest
        .spyOn(authHelper, 'genRandomNickname')
        .mockReturnValue(NICKNAME);

      let i = 0;
      const usersServiceCheckSpy = jest
        .spyOn(usersService, 'checkUserExist')
        .mockImplementation(async () => ++i < count);

      const result = await authResolver.genRandomNickname();

      expect(result).toEqual(NICKNAME);
      // @WARNING: 상단에 같은 method의 spy를 사용하면 CalledTimes에 영향이 있습니다.
      expect(usersServiceCheckSpy).toBeCalledTimes(count);
      expect(authHelperGenRandomNumberSpy).toBeCalledTimes(count);
    });

    it('생성한 닉네임을 그대로 반환한다.', async () => {
      const nickname = faker.lorem.text();

      const authHelperGenRandomNumberSpy = jest
        .spyOn(authHelper, 'genRandomNickname')
        .mockReturnValueOnce(nickname);

      const usersServiceCheckSpy = jest
        .spyOn(usersService, 'checkUserExist')
        .mockResolvedValueOnce(false);

      const result = await authResolver.genRandomNickname();

      expect(result).toEqual(nickname);
      expect(authHelperGenRandomNumberSpy).toBeCalled();
      expect(usersServiceCheckSpy).toBeCalledWith(nickname);
    });
  });
});
