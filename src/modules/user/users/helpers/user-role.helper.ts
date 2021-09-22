import { UserRole } from '../constants';

export const checkIsPermitted = (
  userRole: UserRole,
  role: UserRole
): boolean => {
  if (!userRole || !role) {
    return false;
  }

  const { User, Editor, Seller, Admin } = UserRole;
  const roles = [User, Editor, Seller, Admin];
  return roles.indexOf(userRole) >= roles.indexOf(role);
};
