import { UserRole } from '../constants';

export const checkIsPermitted = (
  userRole: UserRole,
  role: UserRole
): boolean => {
  if (!userRole || !role) {
    return false;
  }

  const { USER, EDITOR, SELLER, ADMIN } = UserRole;
  const roles = [USER, EDITOR, SELLER, ADMIN];
  return roles.indexOf(userRole) >= roles.indexOf(role);
};
