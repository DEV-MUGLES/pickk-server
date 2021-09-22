import * as faker from 'faker';

import { UserRole } from '../constants';

import { checkIsPermitted } from './user-role.helper';

const { USER, EDITOR, SELLER, ADMIN } = UserRole;
const roles = [USER, EDITOR, SELLER, ADMIN];

describe('UserRoleHelpers', () => {
  describe('checkIsPermitted', () => {
    it('should return true when permitted', () => {
      const permittedInputs = [];

      for (let i = 0; i < 5; i++) {
        const [userRoleIdx, targetRoleIdx] = [
          faker.datatype.number(roles.length - 1),
          faker.datatype.number(roles.length - 1),
        ].sort((a, b) => b - a);
        permittedInputs.push([roles[userRoleIdx], roles[targetRoleIdx]]);
      }

      permittedInputs.forEach(([userRole, targetRole]) => {
        expect(checkIsPermitted(userRole, targetRole)).toEqual(true);
      });
    });

    it('should return false when not permitted', () => {
      const notPermittedInputs = [];

      for (let i = 0; i < 5; i++) {
        const targetRoleIdx = Math.max(
          1,
          faker.datatype.number(roles.length - 1)
        );
        const userRoleIdx = faker.datatype.number(targetRoleIdx - 1);

        notPermittedInputs.push([roles[userRoleIdx], roles[targetRoleIdx]]);
      }

      notPermittedInputs.forEach(([userRole, targetRole]) => {
        expect(checkIsPermitted(userRole, targetRole)).toEqual(false);
      });
    });

    it('should return false when invalid', () => {
      const invalidInputs = [
        [null, null],
        [undefined, undefined],
        [USER, null],
      ];

      invalidInputs.forEach(([userRole, targetRole]) => {
        expect(checkIsPermitted(userRole, targetRole)).toEqual(false);
      });
    });
  });
});
