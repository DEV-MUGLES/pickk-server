import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from './dtos/shipping-address.input';
import { CreateUserInput } from './dtos/user.input';
import { ShippingAddress } from './models/shipping-address.model';
import { UserAvatarImage } from './models/user-avatar-image.model';
import { UserPassword } from './models/user-password.model';
import { User } from './models/user.model';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

const USER_PASSWORD_1 = 'abcd1234!';
const USER_PASSWORD_2 = 'efgh7890@';

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
      const createUserInput: CreateUserInput = {
        name: faker.lorem.sentence(),
        password: USER_PASSWORD_1,
        email: faker.internet.email(),
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
      const userId = faker.random.number();
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

  describe('updateAvatarImage', () => {
    it('should success when avatarImage not exist', async () => {
      const key = faker.lorem.text(50);
      const avatarImage = new UserAvatarImage({ key });

      const user = new User();

      const userSetAvatarImageSpy = jest
        .spyOn(user, 'setAvatarImage')
        .mockImplementationOnce(() => {
          user.avatarImage = avatarImage;
          return user.avatarImage;
        });
      const usersRepositorySaveSpy = jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValueOnce(new User({ ...user, avatarImage }));

      const result = await usersService.updateAvatarImage(user, key);
      expect(result).toEqual(avatarImage);
      expect(userSetAvatarImageSpy).toHaveBeenCalledWith(key);
      expect(usersRepositorySaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should success when avatarImage already exist', async () => {
      const key = faker.lorem.text(50);
      const avatarImage = new UserAvatarImage({ key });

      const existingAvatarImage = new UserAvatarImage();
      const user = new User({ avatarImage: existingAvatarImage });

      const userAvatarImageRemoveSpy = jest
        .spyOn(existingAvatarImage, 'remove')
        .mockImplementationOnce(() => null);
      const userSetAvatarImageSpy = jest
        .spyOn(user, 'setAvatarImage')
        .mockImplementationOnce(() => {
          user.avatarImage = avatarImage;
          return user.avatarImage;
        });
      const usersRepositorySaveSpy = jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValueOnce(new User({ ...user, avatarImage }));

      const result = await usersService.updateAvatarImage(user, key);
      expect(result).toEqual(avatarImage);
      expect(userAvatarImageRemoveSpy).toHaveBeenCalledWith();
      expect(userSetAvatarImageSpy).toHaveBeenCalledWith(key);
      expect(usersRepositorySaveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeAvatarImage', () => {
    it('should return avatarImage when success', async () => {
      const avatarImage = new UserAvatarImage();

      const user = new User({ avatarImage });

      const userAvatarImageRemoveSpy = jest
        .spyOn(avatarImage, 'remove')
        .mockImplementationOnce(() => null);
      const userRemoveAvatarImageSpy = jest
        .spyOn(user, 'removeAvatarImage')
        .mockImplementationOnce(() => {
          user.avatarImage = null;
          return avatarImage;
        });
      const usersRepositorySaveSpy = jest
        .spyOn(usersRepository, 'save')
        .mockImplementationOnce(jest.fn());

      const result = await usersService.removeAvatarImage(user);
      expect(result).toEqual(avatarImage);
      expect(userAvatarImageRemoveSpy).toHaveBeenCalledWith();
      expect(userRemoveAvatarImageSpy).toHaveBeenCalledWith();
      expect(usersRepositorySaveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePassword', () => {
    it('should return user when success', async () => {
      const oldPassword = USER_PASSWORD_1;
      const newPassword = USER_PASSWORD_2;
      const user = new User({
        password: UserPassword.create(oldPassword),
      });
      const updatedUser = new User({
        ...user,
        password: UserPassword.create(newPassword),
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

  describe('getShippingAddresses', () => {
    it('should return existing shippingAddresses', async () => {
      const shippingAddresses = [
        new ShippingAddress(),
        new ShippingAddress(),
        new ShippingAddress(),
      ];
      const user = new User({ shippingAddresses });

      const result = await usersService.getShippingAddresses(user);
      expect(result).toEqual(shippingAddresses);
    });

    it('should get shippingAddresses relation when not initialized', async () => {
      const user = new User({
        id: faker.random.number(),
      });
      const shippingAddresses = [
        new ShippingAddress(),
        new ShippingAddress(),
        new ShippingAddress(),
      ];

      const usersRepositoryGetSpy = jest
        .spyOn(usersRepository, 'get')
        .mockResolvedValue(
          new User({
            ...user,
            shippingAddresses,
          })
        );

      const result = await usersService.getShippingAddresses(user);
      expect(result).toEqual(shippingAddresses);
      expect(usersRepositoryGetSpy).toHaveBeenCalledWith(user.id, [
        'shippingAddresses',
      ]);
    });
  });

  describe('addShippingAddress', () => {
    const createShippingAddressInput: CreateShippingAddressInput = {
      name: faker.lorem.text(),
      receiverName: faker.lorem.text(),
      baseAddress: faker.lorem.text(),
      detailAddress: faker.lorem.text(),
      postalCode: faker.address.zipCode('#####'),
      phoneNumber1: faker.phone.phoneNumber('###-####-####'),
      isPrimary: faker.random.boolean(),
    };

    it('should return list when success', async () => {
      const user = new User();
      const shippingAddress = new ShippingAddress(createShippingAddressInput);
      const addedUser = new User({
        ...user,
        shippingAddresses: [shippingAddress],
      });

      const userModelAddShippingAddressSpy = jest.spyOn(
        user,
        'addShippingAddress'
      );
      jest.spyOn(usersRepository, 'save').mockResolvedValue(addedUser);

      const result = await usersService.addShippingAddress(
        user,
        createShippingAddressInput
      );
      expect(result).toEqual([shippingAddress]);
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
      const shippingAddress = new ShippingAddress({
        id: faker.random.number(),
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

      const userModelUpdateShippingAddressSpy = jest.spyOn(
        user,
        'updateShippingAddress'
      );
      jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);

      const result = await usersService.updateShippingAddress(
        user,
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

  describe('removeShippingAddress', () => {
    it('should return removed address when success', async () => {
      const addressId = faker.random.number();
      const shippingAddress = new ShippingAddress({
        id: addressId,
      });
      const user = new User({
        shippingAddresses: [shippingAddress],
      });
      const remainShippingAddresses = [];
      const updatedUser = new User({
        ...user,
        shippingAddresses: remainShippingAddresses,
      });

      const userModelRemoveShippingAddressSpy = jest
        .spyOn(user, 'removeShippingAddress')
        .mockReturnValueOnce(shippingAddress);
      const shippingAddressRemoveSpy = jest
        .spyOn(shippingAddress, 'remove')
        .mockImplementation(() => null);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);

      const result = await usersService.removeShippingAddress(user, addressId);
      expect(result).toEqual(remainShippingAddresses);
      expect(userModelRemoveShippingAddressSpy).toHaveBeenCalledWith(addressId);
      expect(shippingAddressRemoveSpy).toBeCalledTimes(1);
    });
  });
});
