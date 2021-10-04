import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { FollowsService } from '@user/follows/follows.service';

import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
  CreateUserInput,
} from './dtos';
import { ShippingAddress, UserPassword, User } from './models';

import {
  RefundAccountsRepository,
  ShippingAddressesRepository,
  UsersRepository,
} from './users.repository';
import { UsersService } from './users.service';

const USER_PASSWORD_1 = 'abcd1234!';
const USER_PASSWORD_2 = 'efgh7890@';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        ShippingAddressesRepository,
        RefundAccountsRepository,
        {
          provide: FollowsService,
          useValue: new FollowsService(null, null),
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('creating a user', () => {
    it('create success', async () => {
      const createUserInput: CreateUserInput = {
        nickname: faker.lorem.sentence(),
        password: USER_PASSWORD_1,
        email: faker.internet.email(),
        avatarUrl: null,
      };

      const newUser = new User({
        name: createUserInput.name,
        email: createUserInput.email,
      });

      jest.spyOn(usersRepository, 'save').mockResolvedValue(newUser);

      const result = await usersService.create(createUserInput);

      expect(result).toEqual(newUser);
    });
  });

  describe('get a user', () => {
    it('get success', async () => {
      const userId = faker.datatype.number();
      const user = Object.assign(new User(), { id: userId });

      const usersRepositoryGetSpy = jest
        .spyOn(usersRepository, 'get')
        .mockResolvedValue(user);

      const result = await usersService.get(userId);

      expect(usersRepositoryGetSpy).toHaveBeenCalledWith(userId, []);
      expect(result).toEqual(user);
    });
  });

  describe('find a user', () => {
    const findOneDto: Partial<User> = {
      name: faker.lorem.text(),
    };

    it('should return matched user', async () => {
      const user = new User(findOneDto);

      const usersRepositoryFindSpy = jest
        .spyOn(usersRepository, 'findOneEntity')
        .mockResolvedValue(user);

      const result = await usersService.findOne(findOneDto);

      expect(result).toEqual(user);
      expect(usersRepositoryFindSpy).toHaveBeenCalledWith(findOneDto, []);
    });
  });

  describe('updatePassword', () => {
    it('should return user when success', async () => {
      const oldPassword = USER_PASSWORD_1;
      const newPassword = USER_PASSWORD_2;
      const user = new User({
        password: UserPassword.of(oldPassword),
      });
      const updatedUser = new User({
        ...user,
        password: UserPassword.of(newPassword),
      });

      const userModelUpdatePasswordSpy = jest
        .spyOn(user, 'updatePassword')
        .mockReturnValue(updatedUser);
      const usersRepositorySaveSpy = jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue(updatedUser);

      const result = await usersService.updatePassword(
        user,
        oldPassword,
        newPassword
      );
      expect(result).toEqual(updatedUser);
      expect(userModelUpdatePasswordSpy).toHaveBeenCalledWith(
        oldPassword,
        newPassword
      );
      expect(usersRepositorySaveSpy).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('addShippingAddress', () => {
    const createShippingAddressInput: CreateShippingAddressInput = {
      name: faker.lorem.text(),
      receiverName: faker.lorem.text(),
      baseAddress: faker.lorem.text(),
      detailAddress: faker.lorem.text(),
      postalCode: faker.address.zipCode('#####'),
      phoneNumber: faker.phone.phoneNumber('###-####-####'),
      isPrimary: faker.datatype.boolean(),
    };

    it('should return added when success', async () => {
      const user = new User({ id: faker.datatype.number() });
      const shippingAddress = new ShippingAddress(createShippingAddressInput);
      const addedUser = new User({
        ...user,
        shippingAddresses: [shippingAddress],
      });

      jest.spyOn(usersService, 'get').mockResolvedValue(user);
      const userModelAddShippingAddressSpy = jest.spyOn(
        user,
        'addShippingAddress'
      );
      jest.spyOn(usersRepository, 'save').mockResolvedValue(addedUser);

      const result = await usersService.addShippingAddress(
        user.id,
        createShippingAddressInput
      );
      expect(result).toEqual(shippingAddress);
      expect(userModelAddShippingAddressSpy).toHaveBeenCalledWith(
        createShippingAddressInput
      );
    });
  });

  describe('updateShippingAddress', () => {
    const updateShippingAddressInput: UpdateShippingAddressInput = {
      name: faker.lorem.text(),
    };

    it('should return updated address when success', async () => {
      const userId = faker.datatype.number();
      const shippingAddress = new ShippingAddress({
        id: faker.datatype.number(),
        userId,
      });
      const user = new User({
        shippingAddresses: [shippingAddress],
      });

      const updatedShippingAddress = new ShippingAddress({
        ...shippingAddress,
        ...updateShippingAddressInput,
      });
      const updatedUser = new User({
        ...user,
        shippingAddresses: [updatedShippingAddress],
      });

      jest.spyOn(usersService, 'get').mockResolvedValue(user);
      const userModelUpdateShippingAddressSpy = jest.spyOn(
        user,
        'updateShippingAddress'
      );
      jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);

      const result = await usersService.updateShippingAddress(
        user.id,
        shippingAddress.id,
        updateShippingAddressInput
      );
      expect(result).toEqual(updatedShippingAddress);
      expect(userModelUpdateShippingAddressSpy).toHaveBeenCalledWith(
        shippingAddress.id,
        updateShippingAddressInput
      );
    });
  });
});
