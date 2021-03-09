import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UsersService, UsersRepository],
    }).compile();

    usersResolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
  });

  describe('user', () => {
    it('should return matched user', async () => {
      const userId = faker.random.number();
      const user = Object.assign(new User(), { id: userId });

      const usersServiceSpy = jest
        .spyOn(usersService, 'get')
        .mockResolvedValue(user);

      const result = await usersResolver.user(userId);
      expect(result).toEqual(user);
      expect(usersServiceSpy).toHaveBeenCalledWith(userId);
    });
  });
});
