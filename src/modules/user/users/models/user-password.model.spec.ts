import * as faker from 'faker';
import { UserPasswordInvalidException } from '../exceptions';

import { UserPassword } from './user-password.model';

const validPasswords = [
  'abcd1234!',
  'abc1234!',
  'abcdefg4!',
  '1234567a!',
  'a1!@#$%^&',
  'A1!@#$%^&',
];

describe('UserPasswordModel', () => {
  describe('create', () => {
    it('should be created well', () => {
      const userPassword = UserPassword.of(validPasswords[0]);
      expect(userPassword).toBeTruthy();
      expect(userPassword.salt).toBeTruthy();
      expect(userPassword.encrypted).toBeTruthy();
      expect(userPassword.createdAt).toBeTruthy();
    });

    it('should throw UserPasswordInvalidException when password is invalid', () => {
      const invalidPassword = '123';
      const userPasswordValidateSpy = jest
        .spyOn(UserPassword, 'validate')
        .mockReturnValueOnce(false);

      expect(() => {
        UserPassword.of(invalidPassword);
      }).toThrow(UserPasswordInvalidException);
      expect(userPasswordValidateSpy).toHaveBeenCalledWith(invalidPassword);
    });
  });

  describe('compare', () => {
    it('should return true when matched', () => {
      const userPassword = UserPassword.of(validPasswords[0]);
      expect(userPassword.compare(validPasswords[0])).toEqual(true);
    });
  });

  describe('validate', () => {
    it('should return true when valid', () => {
      validPasswords.forEach((validPassword) => {
        expect(UserPassword.validate(validPassword)).toEqual(true);
      });
    });

    it('should return false when input is not string', () => {
      expect(UserPassword.validate(undefined)).toEqual(false);
    });

    it('should return false when length is less then UserPassword.minLength', () => {
      expect(
        UserPassword.validate(
          faker.internet.password(UserPassword.minLength - 1)
        )
      ).toEqual(false);
    });

    it('should return false when not contain number', () => {
      const invalidPasswords = ['abab!!@@', 'a!a!b@b@'];
      invalidPasswords.forEach((invalidPassword) => {
        expect(UserPassword.validate(invalidPassword)).toEqual(false);
      });
    });

    it('should return false when not contain alphabet', () => {
      const invalidPasswords = ['1212!!@@', '1!1!2@2@'];
      invalidPasswords.forEach((invalidPassword) => {
        expect(UserPassword.validate(invalidPassword)).toEqual(false);
      });
    });
  });
});
