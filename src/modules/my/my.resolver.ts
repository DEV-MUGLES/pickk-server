import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from '@src/modules/user/users/dto/shipping-address.input';
import { User } from '@src/modules/user/users/models/user.model';
import { UsersService } from '@src/modules/user/users/users.service';
import { ShippingAddress } from '../user/users/models/shipping-address.model';
import { CurrentUser } from '@src/authentication/decorators/current-user.decorator';
import { JwtVerifyGuard } from '@src/authentication/guards';
import {
  SHIPPING_ADDRESSES,
  USER_RELATIONS,
} from '../user/users/constants/user.relation';
import { BaseResolver } from '@src/common/base.resolver';
import { JwtPayload } from '@src/authentication/dto/jwt.dto';
import { GraphQLResolveInfo } from 'graphql';

@Resolver()
export class MyResolver extends BaseResolver {
  relations = USER_RELATIONS;

  constructor(@Inject(UsersService) private usersService: UsersService) {
    super();
  }

  @Query(() => User)
  @UseGuards(JwtVerifyGuard)
  async myProfile(
    @CurrentUser() payload: JwtPayload,
    @Info() info?: GraphQLResolveInfo
  ) {
    return await this.usersService.get(
      payload.sub,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => JwtPayload)
  @UseGuards(JwtVerifyGuard)
  myJwtPayload(@CurrentUser() payload: JwtPayload) {
    return payload;
  }

  @Query(() => ShippingAddress)
  @UseGuards(JwtVerifyGuard)
  async myShippingAddress(
    @CurrentUser() payload: JwtPayload,
    @Args('id') id: number
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
    @Args('addressId') addressId: number,
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
}
