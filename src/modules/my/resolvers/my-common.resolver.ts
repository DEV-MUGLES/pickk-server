import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/dto/jwt.dto';
import { JwtVerifyGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators/args.decorator';
import { BaseResolver } from '@common/base.resolver';

import {
  SHIPPING_ADDRESSES,
  USER_RELATIONS,
} from '@user/users/constants/user.relation';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from '@user/users/dtos/shipping-address.input';
import { UsersService } from '@user/users/users.service';
import { ShippingAddress } from '@user/users/models/shipping-address.model';

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

  @Query(() => ShippingAddress)
  @UseGuards(JwtVerifyGuard)
  async myShippingAddress(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('id') id: number
  ): Promise<ShippingAddress> {
    const user = await this.usersService.get(payload.sub, [SHIPPING_ADDRESSES]);
    const shippingAddress = (
      await this.usersService.getShippingAddresses(user)
    ).find((address) => address.id === id);

    if (!shippingAddress) {
      throw new NotFoundException('배송지 정보가 존재하지 않습니다.');
    }

    return shippingAddress;
  }

  @Query(() => [ShippingAddress])
  @UseGuards(JwtVerifyGuard)
  async myShippingAddresses(
    @CurrentUser() payload: JwtPayload
  ): Promise<ShippingAddress[]> {
    const user = await this.usersService.get(payload.sub, [SHIPPING_ADDRESSES]);
    return await this.usersService.getShippingAddresses(user);
  }

  @Mutation(() => [ShippingAddress])
  @UseGuards(JwtVerifyGuard)
  async addMyShippingAddress(
    @CurrentUser() payload: JwtPayload,
    @Args('createShippingAddressInput')
    createShippingAddressInput: CreateShippingAddressInput
  ): Promise<ShippingAddress[]> {
    const user = await this.usersService.get(payload.sub, [SHIPPING_ADDRESSES]);
    return await this.usersService.addShippingAddress(
      user,
      createShippingAddressInput
    );
  }

  @Mutation(() => ShippingAddress)
  @UseGuards(JwtVerifyGuard)
  async updateMyShippingAddress(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('addressId') addressId: number,
    @Args('updateShippingAddressInput')
    updateShippingAddressInput: UpdateShippingAddressInput
  ): Promise<ShippingAddress> {
    const user = await this.usersService.get(payload.sub, [SHIPPING_ADDRESSES]);
    return await this.usersService.updateShippingAddress(
      user,
      addressId,
      updateShippingAddressInput
    );
  }

  @Mutation(() => [ShippingAddress])
  @UseGuards(JwtVerifyGuard)
  async removeMyShippingAddress(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('addressId') addressId: number
  ): Promise<ShippingAddress[]> {
    const user = await this.usersService.get(payload.sub, [SHIPPING_ADDRESSES]);
    return await this.usersService.removeShippingAddress(user, addressId);
  }
}
