import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, UsersRepository],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('list', () => {
    it('should return an array of users', async () => {
      const result = [new User(), new User(), new User()];

      const usersServiceListSpy = jest
        .spyOn(usersService, 'list')
        .mockResolvedValue(result);

      const users = await usersController.list();

      expect(result).toEqual(users);
      expect(usersServiceListSpy).toHaveBeenCalledWith();
    });
  });
});
