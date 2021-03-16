import { NotFoundException } from '@nestjs/common';
import * as faker from 'faker';

import { User } from './user.model';
import { UserPassword } from './user-password.model';
import { ShippingAddress } from './shipping-address.model';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from '../dto/shipping-address.input';
import {
  UserPasswordDuplicatedException,
  UserPasswordInvalidException,
} from '../exceptions/user.exception';

describe('UserModel', () => {
  describe('updatePassword', () => {
    const OLD_PASSWORD = 'OLD_PASSWORD';
    const NEW_PASSWORD = 'NEW_PASSWORD';

    it('should return void when matched', () => {
      const user = new User();
      user.password = UserPassword.create(OLD_PASSWORD);

      const userPasswordCompareSpy = jest
        .spyOn(user.password, 'compare')
        .mockReturnValue(true);

      const result = user.updatePassword(OLD_PASSWORD, NEW_PASSWORD);

      expect(result).toEqual(undefined);
      expect(userPasswordCompareSpy).toHaveBeenCalledWith(OLD_PASSWORD);
    });

    it('should throw UnauthorizedException when unmatched', () => {
      const user = new User({
        password: UserPassword.create(OLD_PASSWORD),
      });
      const strangePassword = faker.lorem.text();

      const userPasswordCompareSpy = jest
        .spyOn(user.password, 'compare')
        .mockReturnValue(false);

      expect(() => {
        user.updatePassword(strangePassword, NEW_PASSWORD);
      }).toThrow(UserPasswordInvalidException);
      expect(userPasswordCompareSpy).toHaveBeenCalledWith(strangePassword);
    });

    it('should throw ConflictException when before/after password is duplicated', () => {
      const user = new User({
        password: UserPassword.create(OLD_PASSWORD),
      });

      expect(() => {
        user.updatePassword(OLD_PASSWORD, OLD_PASSWORD);
      }).toThrow(UserPasswordDuplicatedException);
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
    it('should return added shippingAddress', () => {
      const user = new User();
      const createShippingAddressInput: CreateShippingAddressInput = {
        name: faker.lorem.text(),
        receiverName: faker.lorem.text(),
        baseAddress: faker.lorem.text(),
        detailAddress: faker.lorem.text(),
        postalCode: faker.address.zipCode('#####'),
        phoneNumber1: faker.phone.phoneNumber('###-####-####'),
        isPrimary: faker.random.boolean(),
      };

      const result = user.addShippingAddress(createShippingAddressInput);
      expect(result.name).toEqual(createShippingAddressInput.name);
    });
  });

  describe('updateShippingAddress', () => {
    it('shoud return updated shippingAddress', () => {
      const addressId = faker.random.number();
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

    it('shoud throw NotFoundException', () => {
      const addressId = faker.random.number();
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
  });

  describe('removeShippingAddress', () => {
    it('shoud return remain shippingAddresses', () => {
      const addressId = faker.random.number();
      const shippingAddresses = [
        new ShippingAddress(),
        new ShippingAddress({ id: addressId }),
        new ShippingAddress(),
      ];
      const user = new User({ shippingAddresses });

      const remainShippingAddresses = [
        shippingAddresses[0],
        shippingAddresses[2],
      ];

      const result = user.removeShippingAddress(addressId);

      expect(result).toEqual(remainShippingAddresses);
    });

    it('shoud throw NotFoundException', () => {
      const addressId = faker.random.number();
      const shippingAddresses = [new ShippingAddress(), new ShippingAddress()];
      const user = new User({ shippingAddresses });

      try {
        user.removeShippingAddress(addressId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
