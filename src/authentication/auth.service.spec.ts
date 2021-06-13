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

    it('Code 일치하는 유저가 없으면 UserCodeNotFoundExeption 발생', async () => {
      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(
        authService.getUserByCodeAuth(codeLoginDto.code, codeLoginDto.password)
      ).rejects.toThrow(UserCodeNotFoundExeption);

      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        code: codeLoginDto.code,
      });
    });

    it('비밀번호가 틀리면 PasswordIncorrectException 발생', async () => {
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

      await expect(
        authService.getUserByCodeAuth(codeLoginDto.code, codeLoginDto.password)
      ).rejects.toThrow(PasswordIncorrectException);
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
