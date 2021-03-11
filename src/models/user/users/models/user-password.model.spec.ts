import { UserPassword } from './user-password.model';

const newPassword = 'NEW_PASSWORD';

describe('UserPasswordModel', () => {
  describe('constructor', () => {
    it('should be created well', () => {
      const userPassword = new UserPassword(newPassword);
      expect(userPassword).toBeTruthy();
      expect(userPassword.salt).toBeTruthy();
      expect(userPassword.encrypted).toBeTruthy();
      expect(userPassword.createdAt).toBeTruthy();
    });
  });

  describe('compare', () => {
    it('should return true when matched', () => {
      const userPassword = new UserPassword(newPassword);
      expect(userPassword.compare(newPassword)).toEqual(true);
    });
  });
});
