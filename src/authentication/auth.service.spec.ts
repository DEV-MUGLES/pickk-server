import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { User } from 'src/models/users/entities/user.entity';
import { UsersRepository } from 'src/models/users/users.repository';
import { UsersService } from 'src/models/users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, UsersRepository],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
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

  describe('validateName', () => {
    const nameLoginDto = {
      name: faker.internet.email(),
      password: faker.lorem.text(),
    };
    it('인증된 유저를 반환한다.', async () => {
      const existingUser = Object.assign(new User(), nameLoginDto);
      const { password, ...expectedResult } = existingUser;

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await authService.validateName(
        nameLoginDto.name,
        nameLoginDto.password
      );

      expect(result).toEqual(expectedResult);
      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        name: nameLoginDto.name,
      });
    });

    it('비밀번호가 틀리면 실패한다.', async () => {
      const existingUser = Object.assign(new User(), {
        ...nameLoginDto,
        password: faker.lorem.text(),
      });

      const usersServiceFindOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await authService.validateName(
        nameLoginDto.name,
        nameLoginDto.password
      );

      expect(result).toEqual(null);
      expect(usersServiceFindOneSpy).toHaveBeenCalledWith({
        name: nameLoginDto.name,
      });
    });
  });
});
