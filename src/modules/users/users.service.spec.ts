import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { CreateUserDto } from './dto';
import { User } from './entities/user.entity';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('creating a user', () => {
    it('create success', async () => {
      const createUserDto: CreateUserDto = {
        name: faker.lorem.sentence(),
        password: faker.lorem.sentence(),
        email: faker.internet.email(),
      };

      const newUser = Object.assign(new User(), createUserDto);

      const userRepositoryCreateSpy = jest
        .spyOn(usersRepository, 'createEntity')
        .mockResolvedValue(newUser);

      const result = await usersService.create(createUserDto);

      expect(userRepositoryCreateSpy).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(newUser);
    });
  });

  describe('get a user', () => {
    it('get success', async () => {
      const userId = faker.random.number();
      const user = Object.assign(new User(), { id: userId });

      const userRepositoryGetSpy = jest
        .spyOn(usersRepository, 'get')
        .mockResolvedValue(user);

      const result = await usersService.get(userId);

      expect(userRepositoryGetSpy).toHaveBeenCalledWith(userId, []);
      expect(result).toEqual(user);
    });
  });

  describe('find a user', () => {
    const findOneDto: Partial<User> = {
      name: faker.lorem.text(),
    };

    it('should return matched user', async () => {
      const user = Object.assign(new User(), findOneDto);

      const userRepositoryFindSpy = jest
        .spyOn(usersRepository, 'findOneEntity')
        .mockResolvedValue(user);

      const result = await usersService.findOne(findOneDto);

      expect(userRepositoryFindSpy).toHaveBeenCalledWith(findOneDto, []);
      expect(result).toEqual(user);
    });
  });
});
