import { UnauthorizedException } from '@nestjs/common';

import { User } from './user.model';
import { UserPassword } from './user-password.model';

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
});
