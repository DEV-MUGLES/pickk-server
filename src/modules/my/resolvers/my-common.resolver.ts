import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@src/authentication/decorators/current-user.decorator';
import { JwtPayload } from '@src/authentication/dto/jwt.dto';
import { JwtAuthGuard, JwtVerifyGuard } from '@src/authentication/guards';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { UploadSingleImageInput } from '@src/common/dtos/image.input';
import { BaseResolver } from '@src/common/base.resolver';
import { AwsS3ProviderService } from '@src/providers/aws/s3/provider.service';

import {
  SHIPPING_ADDRESSES,
  USER_RELATIONS,
} from '@user/users/constants/user.relation';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from '@src/modules/user/users/dtos/shipping-address.input';
import { UpdateUserInput } from '@src/modules/user/users/dtos/user.input';
import { User } from '@user/users/models/user.model';
import { UsersService } from '@user/users/users.service';
import { ShippingAddress } from '@user/users/models/shipping-address.model';
import { UserAvatarImage } from '@user/users/models/user-avatar-image.model';

@Resolver()
export class MyCommonResolver extends BaseResolver {
  relations = USER_RELATIONS;

  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(AwsS3ProviderService) private awsS3Service: AwsS3ProviderService
  ) {
    super();
  }

  @Query(() => JwtPayload, {
    description: 'Bearer token을 받아 JwtPayload를 반환합니다.',
  })
  @UseGuards(JwtVerifyGuard)
  myJwtPayload(@CurrentUser() payload: JwtPayload) {
    return payload;
  }

  @Query(() => User)
  @UseGuards(JwtVerifyGuard)
  async me(
    @CurrentUser() payload: JwtPayload,
    @Info() info?: GraphQLResolveInfo
  ) {
    return await this.usersService.get(
      payload.sub,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => User)
  @UseGuards(JwtVerifyGuard)
  async updateMe(
    @CurrentUser() payload: JwtPayload,
    @Args('updateUserInput') updateUserInput: UpdateUserInput
  ): Promise<User> {
    return await this.usersService.update(payload.sub, { ...updateUserInput });
  }

  @Mutation(() => UserAvatarImage)
  @UseGuards(JwtAuthGuard)
  async updateMyAvatarImage(
    @CurrentUser() user: User,
    @Args('uploadSingleImageInput') { file }: UploadSingleImageInput
  ): Promise<UserAvatarImage> {
    const { filename, mimetype, createReadStream } = await file;
    const { key } = await this.awsS3Service.uploadStream(
      createReadStream(),
      filename,
      mimetype
    );
    return await this.usersService.updateAvatarImage(user, key);
  }

  @Mutation(() => UserAvatarImage)
  @UseGuards(JwtAuthGuard)
  async removeMyAvatarImage(
    @CurrentUser() user: User
  ): Promise<UserAvatarImage> {
    return await this.usersService.removeAvatarImage(user);
  }

  @Mutation(() => User, {
    description: '(!) 예전 비밀번호와 현재 비밀번호를 입력해 ',
  })
  @UseGuards(JwtAuthGuard)
  async updateMyPassword(
    @CurrentUser() user: User,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string
  ): Promise<User> {
    return await this.usersService.updatePassword(
      user,
      oldPassword,
      newPassword
    );
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
