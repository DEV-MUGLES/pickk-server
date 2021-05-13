import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { UsersService } from '@src/modules/user/users/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@src/modules/user/users/users.repository';

import { IJwtToken } from './interfaces/token.interface';
import { User } from '@src/modules/user/users/models/user.model';
import { UserPassword } from '@src/modules/user/users/models/user-password.model';
import { PasswordIncorrectException } from './exceptions/password-incorrect.exception';
import { UserCodeNotFoundExeption } from './exceptions/user.exception';
import * as authHelper from './helpers/auth.helper';

const JWT_TOKEN = 'JWT_TOKEN';
describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        UsersRepository,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => JWT_TOKEN),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('genRandomNickname', () => {
    it('생성한 닉네임의 유저가 존재하는 경우 반복해서 다시 시도한다.', async () => {
      const count = Math.max(faker.datatype.number(100), 1);
      const NICKNAME = 'nickname';

      const authHelperGenRandomNumberSpy = jest
        .spyOn(authHelper, 'genRandomNickname')
        .mockReturnValue(NICKNAME);

      let i = 0;
      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => (++i < count ? new User() : null));

      const result = await authService.genRandomNickname();

      expect(result).toBe(NICKNAME);
      // @WARNING: 상단에 같은 method의 spy를 사용하면 CalledTimes에 영향이 있습니다.
      expect(usersServiceFindOneSpy).toBeCalledTimes(count);
      expect(authHelperGenRandomNumberSpy).toBeCalledTimes(count);
    });

    it('생성한 닉네임을 그대로 반환한다.', async () => {
      const nickname = faker.lorem.text();

      const authHelperGenRandomNumberSpy = jest
        .spyOn(authHelper, 'genRandomNickname')
        .mockImplementationOnce(() => nickname);

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockImplementationOnce(() => null);

      const result = await authService.genRandomNickname();

      expect(result).toBe(nickname);
      expect(usersServiceFindOneSpy).toBeCalled();
      expect(authHelperGenRandomNumberSpy).toBeCalled();
    });
  });

  describe('validateCode', () => {
    const codeLoginDto = {
      code: faker.lorem.text(),
      password: faker.lorem.text(),
    };

    it('성공시 인증된 유저를 반환한다.', async () => {
      const existingUser = Object.assign(new User(), {
        code: codeLoginDto.code,
        password: new UserPassword(),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedResult } = existingUser;

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);
      const userComparePasswordSpy = jest
        .spyOn(existingUser, 'comparePassword')
        .mockReturnValue(true);

      const result = await authService.getUserByCodeAuth(
        codeLoginDto.code,
        codeLoginDto.password
      );

      expect(result.code).toEqual(expectedResult.code);
      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        code: codeLoginDto.code,
      });
      expect(userComparePasswordSpy).toHaveBeenCalledWith(
        codeLoginDto.password
      );
    });

    it('Code 일치하는 유저가 없으면 User', async () => {
      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(null);

      try {
        await authService.getUserByCodeAuth(
          codeLoginDto.code,
          codeLoginDto.password
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UserCodeNotFoundExeption);
      }

      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        code: codeLoginDto.code,
      });
    });

    it('비밀번호가 틀리면 PasswordIncorrectException', async () => {
      const existingUser = Object.assign(new User(), {
        ...codeLoginDto,
        password: new UserPassword(),
      });

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);
      const userComparePasswordSpy = jest
        .spyOn(existingUser, 'comparePassword')
        .mockReturnValue(false);

      try {
        await authService.getUserByCodeAuth(
          codeLoginDto.code,
          codeLoginDto.password
        );
      } catch (error) {
        expect(error).toBeInstanceOf(PasswordIncorrectException);
      }
      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        code: codeLoginDto.code,
      });
      expect(userComparePasswordSpy).toHaveBeenCalledWith(
        codeLoginDto.password
      );
    });
  });

  describe('getToken', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...validatedUser } = new User();
    it('유저의 name과 id를 통해 JWT를 생성한다.', async () => {
      const jwtServiceSignSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue(JWT_TOKEN);

      const expectedResult: IJwtToken = {
        access: JWT_TOKEN,
        refresh: JWT_TOKEN,
      };
      const result = authService.getToken(validatedUser);

      expect(result).toEqual(expectedResult);
      expect(jwtServiceSignSpy).toHaveBeenCalledWith({
        username: validatedUser.name,
        code: validatedUser.code,
        sub: validatedUser.id,
      });
    });
  });
});
