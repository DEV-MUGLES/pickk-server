import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { UserEntity } from '@src/models/user/users/entities/user.entity';
import { UsersRepository } from '@src/models/user/users/users.repository';
import { UsersService } from '@src/models/user/users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtPayload, JwtToken } from './dto/jwt.dto';
import { LoginByEmailInput } from './dto/login.input';

const JWT_TOKEN = 'JWT_TOKEN';
describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
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

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('whoAmI', () => {
    it('should return current user', () => {
      const user = new UserEntity();
      const result = authResolver.whoAmI(user);
      expect(result).toEqual(user);
    });
  });

  describe('getJwtPayload', () => {
    const payload: JwtPayload = {
      username: faker.lorem.text(),
      sub: faker.random.number(),
    };

    it('should work without code', () => {
      const result = authResolver.getJwtPayload(payload);
      expect(result).toEqual(payload);
    });

    it('should return payload', () => {
      payload.code = faker.lorem.text();

      const result = authResolver.getJwtPayload(payload);
      expect(result).toEqual(payload);
    });
  });

  describe('refreshToken', () => {
    it('shoud return refreshed token', async () => {
      const payload: JwtPayload = {
        username: faker.lorem.text(),
        sub: faker.random.number(),
        code: faker.lorem.text(),
      };
      const user = Object.assign(new UserEntity(), {
        id: payload.sub,
        name: payload.username,
        code: payload.code,
      });
      const token: JwtToken = {
        access: faker.lorem.text(),
        refresh: faker.lorem.text(),
      };

      const usersServiceGetSpy = jest
        .spyOn(usersService, 'get')
        .mockResolvedValue(user);
      const authServiceGetTokenSpy = jest
        .spyOn(authService, 'getToken')
        .mockReturnValue(token);

      const result = await authResolver.refreshToken(payload);
      expect(result).toEqual(token);
      expect(usersServiceGetSpy).toHaveBeenCalledWith(payload.sub);
      expect(authServiceGetTokenSpy).toHaveBeenCalledWith(user);
    });
  });

  describe('loginByEmail', () => {
    it('should return matching user', async () => {
      const loginByEmailInput: LoginByEmailInput = {
        email: faker.internet.email(),
        password: faker.lorem.text(),
      };
      const existingUser = Object.assign(new UserEntity(), loginByEmailInput);
      const jwtToken: JwtToken = {
        access: JWT_TOKEN,
        refresh: JWT_TOKEN,
      };

      const authServiceValidateEmailSpy = jest
        .spyOn(authService, 'validateEmail')
        .mockResolvedValue(existingUser);
      const authServiceGetTokenSpy = jest
        .spyOn(authService, 'getToken')
        .mockReturnValue(jwtToken);

      const result = await authResolver.loginByEmail(loginByEmailInput);

      expect(result).toEqual(jwtToken);
      expect(authServiceValidateEmailSpy).toHaveBeenCalledWith(
        loginByEmailInput.email,
        loginByEmailInput.password
      );
      expect(authServiceGetTokenSpy).toHaveBeenCalledWith(existingUser);
    });
  });

  describe('loginByCode', () => {
    it('should return matching user', async () => {
      const loginByEmailInput: LoginByEmailInput = {
        email: faker.internet.email(),
        password: faker.lorem.text(),
      };
      const existingUser = Object.assign(new UserEntity(), loginByEmailInput);
      const jwtToken: JwtToken = {
        access: JWT_TOKEN,
        refresh: JWT_TOKEN,
      };

      const authServiceValidateEmailSpy = jest
        .spyOn(authService, 'validateEmail')
        .mockResolvedValue(existingUser);
      const authServiceGetTokenSpy = jest
        .spyOn(authService, 'getToken')
        .mockReturnValue(jwtToken);

      const result = await authResolver.loginByEmail(loginByEmailInput);

      expect(result).toEqual(jwtToken);
      expect(authServiceValidateEmailSpy).toHaveBeenCalledWith(
        loginByEmailInput.email,
        loginByEmailInput.password
      );
      expect(authServiceGetTokenSpy).toHaveBeenCalledWith(existingUser);
    });
  });
});
