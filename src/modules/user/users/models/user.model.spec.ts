import { NotFoundException } from '@nestjs/common';
import * as faker from 'faker';

import { PasswordIncorrectException } from '@src/authentication/exceptions/password-incorrect.exception';

import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from '../dtos/shipping-address.input';
import {
  UserAvatarImageNotFoundException,
  UserPasswordDuplicatedException,
  UserPasswordNotFoundException,
} from '../exceptions/user.exception';
import { User } from './user.model';
import { UserPassword } from './user-password.model';
import { ShippingAddress } from './shipping-address.model';
import { UserAvatarImage } from './user-avatar-image.model';

describe('UserModel', () => {
  describe('setAvatarImage', () => {
    it('should return avatarImage when success', () => {
      const imageKey = faker.lorem.text();
      const user = new User();

      const result = user.setAvatarImage(imageKey);
      expect(result.key).toEqual(imageKey);
    });
  });

  describe('removeAvatarImage', () => {
    it('should return removed avatarImage when success', () => {
      const avatarImage = new UserAvatarImage();
      const user = new User({ avatarImage });

      const result = user.removeAvatarImage();
      expect(result).toEqual(avatarImage);
    });

    it('should throw UserAvatarImageNotFoundException when not exist', () => {
      const user = new User();

      expect(() => user.removeAvatarImage()).toThrow(
        UserAvatarImageNotFoundException
      );
    });
  });

  describe('updatePassword', () => {
    const OLD_PASSWORD = 'OLD_PASSWORD1!';
    const NEW_PASSWORD = 'NEW_PASSWORD1!';

    it('should return user when matched', () => {
      const user = new User({});
      user.password = UserPassword.create(OLD_PASSWORD);

      const newUserPassword = UserPassword.create(NEW_PASSWORD);
      const updatedUser = new User({
        password: newUserPassword,
      });

      const userPasswordCompareSpy = jest
        .spyOn(user.password, 'compare')
        .mockReturnValue(true);
      const userPasswordCreateSpy = jest
        .spyOn(UserPassword, 'create')
        .mockReturnValue(newUserPassword);

      const result = user.updatePassword(OLD_PASSWORD, NEW_PASSWORD);

      expect(result.password).toEqual(updatedUser.password);
      expect(userPasswordCompareSpy).toHaveBeenCalledWith(OLD_PASSWORD);
      expect(userPasswordCreateSpy).toHaveBeenCalledWith(NEW_PASSWORD);
    });

    it('should throw PasswordIncorrectException when oldPassword incorrect', () => {
      const user = new User({
        password: UserPassword.create(OLD_PASSWORD),
      });
      const strangePassword = faker.lorem.text();

      const userPasswordCompareSpy = jest
        .spyOn(user.password, 'compare')
        .mockReturnValue(false);

      expect(() => {
        user.updatePassword(strangePassword, NEW_PASSWORD);
      }).toThrow(PasswordIncorrectException);
      expect(userPasswordCompareSpy).toHaveBeenCalledWith(strangePassword);
    });

    it('should throw UserPasswordDuplicatedException when old/new passwords are same', () => {
      const user = new User({
        password: UserPassword.create(OLD_PASSWORD),
      });

      const userPasswordCompareSpy = jest
        .spyOn(user.password, 'compare')
        .mockReturnValue(true);

      expect(() => {
        user.updatePassword(OLD_PASSWORD, OLD_PASSWORD);
      }).toThrow(UserPasswordDuplicatedException);
      expect(userPasswordCompareSpy).toHaveBeenCalledWith(OLD_PASSWORD);
    });
  });

  describe('comparePassword', () => {
    const OLD_PASSWORD = 'OLD_PASSWORD1!';

    it('should return true when matched', () => {
      const user = new User({});
      user.password = UserPassword.create(OLD_PASSWORD);

      const userPasswordCompareSpy = jest
        .spyOn(user.password, 'compare')
        .mockReturnValueOnce(true);

      const result = user.comparePassword(OLD_PASSWORD);

      expect(result).toEqual(true);
      expect(userPasswordCompareSpy).toHaveBeenCalledWith(OLD_PASSWORD);
    });

    it('should return false when unmatched', () => {
      const user = new User({});
      user.password = UserPassword.create(OLD_PASSWORD);

      const strangePassword = faker.lorem.text();

      const userPasswordCompareSpy = jest
        .spyOn(user.password, 'compare')
        .mockReturnValueOnce(false);

      const result = user.comparePassword(strangePassword);

      expect(result).toEqual(false);
      expect(userPasswordCompareSpy).toHaveBeenCalledWith(strangePassword);
    });

    it('should throw UserPasswordNotFoundException when password not found', () => {
      const user = new User({});

      const strangePassword = faker.lorem.text();

      expect(() => user.comparePassword(strangePassword)).toThrow(
        UserPasswordNotFoundException
      );
    });
  });

  describe('getShippingAddresses', () => {
    it('shoud return all shippingAddresses', async () => {
      const shippingAddresses = [
        new ShippingAddress(),
        new ShippingAddress(),
        new ShippingAddress(),
      ];
      const user = new User({ shippingAddresses });

      const result = await user.getShippingAddresses();
      expect(result).toEqual(shippingAddresses);
    });

    it('shoud return empty array when null', () => {
      const user = new User({ shippingAddresses: null });

      const result = user.getShippingAddresses();
      expect(result).toEqual([]);
    });

    it('shoud return undefined when undefined', () => {
      const user = new User();

      const result = user.getShippingAddresses();
      expect(result).toEqual(undefined);
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
      isPrimary: faker.datatype.boolean(),
    };

    it('should return added shippingAddress', () => {
      const user = new User();

      const result = user.addShippingAddress({
        ...createShippingAddressInput,
        isPrimary: true,
      });
      expect(result.name).toEqual(createShippingAddressInput.name);
    });

    it('first shippingAddress should be primary', () => {
      const user = new User();

      const result = user.addShippingAddress({
        ...createShippingAddressInput,
        isPrimary: false,
      });
      expect(result.name).toEqual(createShippingAddressInput.name);
      expect(result.isPrimary).toEqual(true);
    });

    it('new primary shippingAddress should override existing primary', () => {
      const user = new User();

      const existingPrimaryAddress = user.addShippingAddress({
        ...createShippingAddressInput,
        isPrimary: true,
      });
      const result = user.addShippingAddress({
        ...createShippingAddressInput,
        isPrimary: true,
      });
      expect(existingPrimaryAddress.isPrimary).toEqual(false);
      expect(result.isPrimary).toEqual(true);
    });
  });

  describe('updateShippingAddress', () => {
    it('shoud return updated shippingAddress', () => {
      const addressId = faker.datatype.number();
      const shippingAddresses = [
        new ShippingAddress(),
        new ShippingAddress({ id: addressId }),
        new ShippingAddress(),
      ];
      const user = new User({ shippingAddresses });

      const updateShippingAddressInput: UpdateShippingAddressInput = {
        receiverName: faker.lorem.text(),
        baseAddress: faker.lorem.text(),
      };

      const result = user.updateShippingAddress(
        addressId,
        updateShippingAddressInput
      );

      expect(result.receiverName).toEqual(
        updateShippingAddressInput.receiverName
      );
    });

    it('shoud throw NotFoundException when not found', () => {
      const addressId = faker.datatype.number();
      const shippingAddresses = [new ShippingAddress(), new ShippingAddress()];
      const user = new User({ shippingAddresses });

      const updateShippingAddressInput: UpdateShippingAddressInput = {
        receiverName: faker.lorem.text(),
        baseAddress: faker.lorem.text(),
      };

      try {
        user.updateShippingAddress(addressId, updateShippingAddressInput);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('new primary should override existing one', () => {
      const addressId = faker.datatype.number();
      const shippingAddresses = [
        new ShippingAddress({ isPrimary: true }),
        new ShippingAddress({ id: addressId }),
      ];
      const user = new User({ shippingAddresses });

      const updateShippingAddressInput: UpdateShippingAddressInput = {
        isPrimary: true,
      };

      const result = user.updateShippingAddress(
        addressId,
        updateShippingAddressInput
      );
      expect(result.isPrimary).toEqual(true);
      expect(user.shippingAddresses[0].isPrimary).toEqual(false);
    });
  });

  describe('removeShippingAddress', () => {
    it('shoud return removed shippingAddresses', () => {
      const addressId = faker.datatype.number();
      const shippingAddress = new ShippingAddress({ id: addressId });
      const shippingAddresses = [
        new ShippingAddress(),
        shippingAddress,
        new ShippingAddress(),
      ];
      const user = new User({ shippingAddresses });

      const result = user.removeShippingAddress(addressId);

      expect(result).toEqual(shippingAddress);
    });

    it('shoud throw NotFoundException when not found', () => {
      const addressId = faker.datatype.number();
      const shippingAddresses = [new ShippingAddress(), new ShippingAddress()];
      const user = new User({ shippingAddresses });

      try {
        user.removeShippingAddress(addressId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('shoud make first address primary when deleted address is primary', () => {
      const addressId = faker.datatype.number();
      const shippingAddress = new ShippingAddress({
        id: addressId,
        isPrimary: true,
      });
      const shippingAddresses = [
        new ShippingAddress({ isPrimary: false }),
        shippingAddress,
      ];
      const user = new User({ shippingAddresses });

      const result = user.removeShippingAddress(addressId);

      expect(result).toEqual(shippingAddress);
      expect(user.shippingAddresses[0].isPrimary).toEqual(true);
    });
  });
});
