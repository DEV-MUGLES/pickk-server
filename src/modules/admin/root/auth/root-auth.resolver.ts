import { Args, Query, Resolver } from '@nestjs/graphql';

import { JwtToken } from '@auth/models';
import { LoginByCodeInput } from '@auth/dtos';
import { IntArgs } from '@common/decorators';
import { checkIsPermitted } from '@user/users/helpers';
import { ForbiddenResourceException } from '@auth/exceptions';
import { AuthService } from '@auth/auth.service';
import { UserRole } from '@user/users/constants';
import { SellersService } from '@item/sellers/sellers.service';

@Resolver()
export class RootAuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly sellersService: SellersService
  ) {}

  @Query(() => JwtToken)
  async loginRootSeller(
    @Args('loginByCodeInput') loginByCodeInput: LoginByCodeInput,
    @IntArgs('sellerId') sellerId: number
  ): Promise<JwtToken> {
    const { code, password, minRole } = loginByCodeInput;
    const user = await this.authService.getUserByCodeAuth(code, password);
    if (!checkIsPermitted(user.role, UserRole.Admin)) {
      throw new ForbiddenResourceException(minRole);
    }

    const seller = await this.sellersService.get(sellerId, ['brand', 'user']);

    return this.authService.getSellerToken(seller);
  }
}
