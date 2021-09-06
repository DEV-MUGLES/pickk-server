import { UseGuards } from '@nestjs/common';
import {
  Args,
  Info,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { JwtAuthGuard, JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { OrderItemsService } from '@order/order-items/order-items.service';
import { PointsService } from '@order/points/points.service';
import { FollowsService } from '@user/follows/follows.service';

import { USER_RELATIONS } from './constants';
import { CreateUserInput, UpdateUserInput } from './dtos';
import { UserEntity } from './entities';
import { User } from './models';

import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver extends BaseResolver {
  relations = USER_RELATIONS;

  constructor(
    private readonly usersService: UsersService,
    private readonly pointsService: PointsService,
    private readonly orderItemsService: OrderItemsService,
    private readonly followsService: FollowsService
  ) {
    super();
  }

  @ResolveField(() => Int, {
    description: '[ResolveField] 활성화된 주문건들 개수',
  })
  async activeOrderItemsCount(@Parent() user: User) {
    return await this.orderItemsService.getActivesCount(user.id);
  }

  @ResolveField(() => Int, {
    description: '[ResolveField] 사용가능 포인트 잔고',
  })
  async availablePoint(@Parent() user: User) {
    return await this.pointsService.getAvailableAmount(user.id);
  }

  @ResolveField(() => Int, {
    description: '[ResolveField] 적립예정 포인트 잔고',
  })
  async expectedPoint(@Parent() user: User) {
    return await this.pointsService.getExpectedAmount(user.id);
  }

  @Query(() => User)
  @UseGuards(JwtOrNotGuard)
  async user(
    @CurrentUser() payload: JwtPayload,
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<UserEntity> {
    return await this.usersService.get(
      id,
      this.getRelationsFromInfo(info),
      payload?.sub
    );
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserEntity> {
    return await this.usersService.create(createUserInput);
  }

  @Query(() => User)
  @UseGuards(JwtVerifyGuard)
  async me(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Info() info?: GraphQLResolveInfo
  ) {
    return await this.usersService.get(userId, this.getRelationsFromInfo(info));
  }

  @Mutation(() => User)
  @UseGuards(JwtVerifyGuard)
  async updateMe(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<User> {
    await this.usersService.update(userId, { ...updateUserInput });

    return await this.usersService.get(userId, this.getRelationsFromInfo(info));
  }

  @Mutation(() => User, {
    description: '(!) 예전 비밀번호와 현재 비밀번호를 입력해주세요.',
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

  @Query(() => [User])
  @UseGuards(JwtVerifyGuard)
  async meFollowingUsers(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Info() info?: GraphQLResolveInfo
  ): Promise<User[]> {
    const idIn = await this.followsService.getFollowingUserIds(userId);

    return await this.usersService.list(
      { idIn, orderBy: 'followCount' },
      null,
      this.getRelationsFromInfo(info)
    );
  }
}
