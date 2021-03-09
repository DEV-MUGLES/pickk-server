import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { UsersService } from '@src/models/user/users/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@src/models/user/users/users.repository';

import { User } from '@src/models/user/users/entities/user.entity';
import { IJwtToken } from './interfaces/token.interface';

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
      const existingUser = Object.assign(new User(), emailLoginDto);
      const { password, ...expectedResult } = existingUser;

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await authService.validateEmail(
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
        password: faker.lorem.text(),
      });

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await authService.validateEmail(
        emailLoginDto.email,
        emailLoginDto.password
      );

      expect(result).toEqual(null);
      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        email: emailLoginDto.email,
      });
    });
  });

  describe('validateCode', () => {
    const codeLoginDto = {
      code: faker.internet.email(),
      password: faker.lorem.text(),
    };
    it('인증된 유저를 반환한다.', async () => {
      const existingUser = Object.assign(new User(), codeLoginDto);
      const { password, ...expectedResult } = existingUser;

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await authService.validateCode(
        codeLoginDto.code,
        codeLoginDto.password
      );

      expect(result).toEqual(expectedResult);
      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        code: codeLoginDto.code,
      });
    });

    it('비밀번호가 틀리면 실패한다.', async () => {
      const existingUser = Object.assign(new User(), {
        ...codeLoginDto,
        password: faker.lorem.text(),
      });

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await authService.validateCode(
        codeLoginDto.code,
        codeLoginDto.password
      );

      expect(result).toEqual(null);
      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        code: codeLoginDto.code,
      });
    });
  });

  describe('getToken', () => {
    const { password, ...validatedUser } = new User();
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
