import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '@user/users/constants';
import { User } from '@user/users/models';

import { ROLES_KEY } from '../decorators';
import { ForbiddenResourceException } from '../exceptions';

import { GqlAuthGuard } from './gql-auth.guard';

@Injectable()
export class JwtAuthGuard extends GqlAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const _canActivate = await super.canActivate(context);
    if (!_canActivate) {
      return false;
    }

    const user: User = this.getRequest(context).user;

    const roles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler()
    );

    return this.canAccess(user, roles);
  }

  canAccess(user: User, roles: UserRole[]): boolean {
    if (!roles) {
      return true;
    }
    const isAvailable = roles.some((role) =>
      this.checkIsPermitted(user.role, role)
    );
    if (!isAvailable) {
      throw new ForbiddenResourceException(roles[0]);
    }

    return true;
  }

  checkIsPermitted(userRole: UserRole, role: UserRole) {
    const { USER, EDITOR, SELLER, ADMIN } = UserRole;
    const roles = [USER, EDITOR, SELLER, ADMIN];
    return roles.indexOf(userRole) >= roles.indexOf(role);
  }
}
