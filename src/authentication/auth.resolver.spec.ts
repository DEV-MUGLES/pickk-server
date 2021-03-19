import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { UsersRepository } from '@src/modules/user/users/users.repository';
import { UsersService } from '@src/modules/user/users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtPayload, JwtToken } from './dto/jwt.dto';
import { LoginByCodeInput, LoginByEmailInput } from './dto/login.input';
import { User } from '@src/modules/user/users/models/user.model';

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
            sign: jest.fn(() => JWT_TOKEN),
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
        username: faker.lorem.text(),
        sub: faker.random.number(),
        code: faker.lorem.text(),
        iat: new Date().getTime(),
        exp: new Date().getTime(),
      };
      const user = new User({
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

      const result = await authResolver.refreshJwtToken(payload);
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
      const existingUser = new User({ email: loginByEmailInput.email });
      const jwtToken: JwtToken = {
        access: JWT_TOKEN,
        refresh: JWT_TOKEN,
      };

      const authServiceValidateEmailSpy = jest
        .spyOn(authService, 'getUserByEmailAuth')
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
      const loginByCodeInput: LoginByCodeInput = {
        code: faker.lorem.text(),
        password: faker.lorem.text(),
      };
      const existingUser = new User({
        code: loginByCodeInput.code,
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
});
