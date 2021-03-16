import { UnauthorizedException } from '@nestjs/common';
import * as faker from 'faker';

import { User } from './user.model';
import { UserPassword } from './user-password.model';
import { ShippingAddress } from './shipping-address.model';
import { CreateShippingAddressInput } from '../dto/shipping-address.input';

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

    it('should raise Unauthorized error when unmatched', () => {
      const user = new User();
      user.password = UserPassword.create(OLD_PASSWORD);

      const userPasswordCompareSpy = jest
        .spyOn(user.password, 'compare')
        .mockReturnValue(false);

      expect(() => {
        user.updatePassword(NEW_PASSWORD, NEW_PASSWORD);
      }).toThrow(UnauthorizedException);
      expect(userPasswordCompareSpy).toHaveBeenCalledWith(NEW_PASSWORD);
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
});
