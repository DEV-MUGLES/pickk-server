import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { UsersService } from '@src/models/user/users/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@src/models/user/users/users.repository';

import { UserEntity } from '@src/models/user/users/entities/user.entity';
import { IJwtToken } from './interfaces/token.interface';
import { User } from '@src/models/user/users/models/user.model';
import { UserPassword } from '@src/models/user/users/models/user-password.model';
import { UnauthorizedException } from '@nestjs/common';

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
            sign: jest.fn((_params) => JWT_TOKEN),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateEmail', () => {
    const emailLoginDto = {
      email: faker.internet.email(),
      password: faker.lorem.text(),
    };
    it('인증된 유저를 반환한다.', async () => {
      const existingUser = Object.assign(new User(), {
        email: emailLoginDto.email,
        password: new UserPassword(emailLoginDto.password),
      });
      const { password, ...expectedResult } = existingUser;

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await authService.getUserByEmailAuth(
        emailLoginDto.email,
        emailLoginDto.password
      );

      expect(result).toEqual(expectedResult);
      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        email: emailLoginDto.email,
      });
    });

    it('비밀번호가 틀리면 실패한다.', async () => {
      const existingUser = Object.assign(new User(), {
        ...emailLoginDto,
        password: new UserPassword(faker.lorem.text()),
      });

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);

      try {
        await authService.getUserByEmailAuth(
          emailLoginDto.email,
          emailLoginDto.password
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }

      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        email: emailLoginDto.email,
      });
    });
  });

  describe('validateCode', () => {
    const codeLoginDto = {
      code: faker.lorem.text(),
      password: faker.lorem.text(),
    };
    it('인증된 유저를 반환한다.', async () => {
      const existingUser = Object.assign(new User(), {
        code: codeLoginDto.code,
        password: new UserPassword(codeLoginDto.password),
      });
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

    it('비밀번호가 틀리면 실패한다.', async () => {
      const existingUser = Object.assign(new User(), {
        ...codeLoginDto,
        password: new UserPassword(faker.lorem.text()),
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
        expect(error).toBeInstanceOf(UnauthorizedException);
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
    const { password, ...validatedUser } = new UserEntity();
    it('유저의 name과 id를 통해 JWT를 생성한다.', async () => {
      const jwtServiceSignSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue(JWT_TOKEN);

      const expectedResult: IJwtToken = {
        access: JWT_TOKEN,
        refresh: JWT_TOKEN,
      };
      const result = await authService.getToken(validatedUser);

      expect(result).toEqual(expectedResult);
      expect(jwtServiceSignSpy).toHaveBeenCalledWith({
        username: validatedUser.name,
        code: validatedUser.code,
        sub: validatedUser.id,
      });
    });
  });
});
