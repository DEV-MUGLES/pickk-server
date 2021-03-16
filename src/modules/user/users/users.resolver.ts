import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@src/common/base.resolver';
import { GraphQLResolveInfo } from 'graphql';
import { CreateShippingAddressInput } from './dto/shipping-address.input';
import { CreateUserInput } from './dto/user.input';
import { UserEntity } from './entities/user.entity';
import { User } from './models/user.model';
import { UsersService } from './users.service';

const SHIPPING_ADDRESSES = 'shippingAddresses';

@Resolver(() => User)
export class UsersResolver extends BaseResolver {
  relations = [SHIPPING_ADDRESSES];

  constructor(@Inject(UsersService) private usersService: UsersService) {
    super();
  }

  @Query(() => User)
  async user(
    @Args('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<UserEntity> {
    return await this.usersService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [User])
  async users(@Info() info?: GraphQLResolveInfo): Promise<UserEntity[]> {
    return await this.usersService.list(this.getRelationsFromInfo(info));
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserEntity> {
    return await this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async addShippingAddress(
    @Args('userId') userId: number,
    @Args('createShippingAddressInput')
    createShippingAddressInput: CreateShippingAddressInput
  ): Promise<UserEntity> {
    const user = await this.usersService.get(userId, [SHIPPING_ADDRESSES]);
    return await this.usersService.addShippingAddress(
      user,
      createShippingAddressInput
    );
  }
}
