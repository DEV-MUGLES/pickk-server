import { Inject, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { JwtVerifyGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { USER_RELATIONS } from '@user/users/constants';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
  CreateRefundAccountInput,
  UpdateRefundAccountInput,
} from '@user/users/dtos';
import { RefundAccount, ShippingAddress, User } from '@user/users/models';
import { UsersService } from '@user/users/users.service';

@Resolver()
export class MyCommonResolver extends BaseResolver {
  relations = USER_RELATIONS;

  constructor(@Inject(UsersService) private usersService: UsersService) {
    super();
  }

  @Query(() => JwtPayload, {
    description: 'Bearer token을 받아 JwtPayload를 반환합니다.',
  })
  @UseGuards(JwtVerifyGuard)
  myJwtPayload(@CurrentUser() payload: JwtPayload) {
    return payload;
  }

  @Query(() => [ShippingAddress])
  @UseGuards(JwtVerifyGuard)
  async meShippingAddresses(
    @CurrentUser() { sub: userId }: JwtPayload
  ): Promise<ShippingAddress[]> {
    return await this.usersService.listShippingAddress(userId);
  }

  @Mutation(() => ShippingAddress)
  @UseGuards(JwtVerifyGuard)
  async addMeShippingAddress(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('createShippingAddressInput')
    createShippingAddressInput: CreateShippingAddressInput
  ): Promise<ShippingAddress> {
    return await this.usersService.addShippingAddress(
      userId,
      createShippingAddressInput
    );
  }

  @Mutation(() => ShippingAddress)
  @UseGuards(JwtVerifyGuard)
  async updateMeShippingAddress(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('addressId') addressId: number,
    @Args('updateShippingAddressInput')
    updateShippingAddressInput: UpdateShippingAddressInput
  ): Promise<ShippingAddress> {
    return await this.usersService.updateShippingAddress(
      userId,
      addressId,
      updateShippingAddressInput
    );
  }

  @Mutation(() => [ShippingAddress])
  @UseGuards(JwtVerifyGuard)
  async removeMeShippingAddress(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('addressId') addressId: number
  ): Promise<ShippingAddress[]> {
    const user = await this.usersService.get(payload.sub, [
      'shippingAddresses',
    ]);
    return await this.usersService.removeShippingAddress(user, addressId);
  }

  @Mutation(() => RefundAccount)
  @UseGuards(JwtVerifyGuard)
  async addMeRefundAccount(
    @CurrentUser() payload: JwtPayload,
    @Args('createRefundAccountInput')
    createRefundAccountInput: CreateRefundAccountInput
  ): Promise<RefundAccount> {
    const user = await this.usersService.get(payload.sub, ['refundAccount']);
    return await this.usersService.addRefundAccount(
      user,
      createRefundAccountInput
    );
  }

  @Mutation(() => RefundAccount)
  @UseGuards(JwtVerifyGuard)
  async updateMeRefundAccount(
    @CurrentUser() payload: JwtPayload,
    @Args('updateRefundAccountInput')
    updateRefundAccountInput: UpdateRefundAccountInput
  ): Promise<RefundAccount> {
    const user = await this.usersService.get(payload.sub, []);
    return await this.usersService.updateRefundAccount(
      user,
      updateRefundAccountInput
    );
  }

  @Mutation(() => User)
  @UseGuards(JwtVerifyGuard)
  async removeMeRefundAccount(
    @CurrentUser() payload: JwtPayload,
    @Info() info?: GraphQLResolveInfo
  ): Promise<User> {
    const user = await this.usersService.get(payload.sub, ['refundAccount']);
    await this.usersService.removeRefundAccount(user);
    return await this.usersService.get(
      payload.sub,
      this.getRelationsFromInfo(info)
    );
  }
}
