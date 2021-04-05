import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { IntArgs } from '@src/common/decorators/args.decorator';
import { BaseResolver } from '@src/common/base.resolver';
import { CreateUserInput } from './dtos/user.input';
import { UserEntity } from './entities/user.entity';
import { User } from './models/user.model';
import { UsersService } from './users.service';

import { USER_RELATIONS } from './constants/user.relation';

@Resolver(() => User)
export class UsersResolver extends BaseResolver {
  relations = USER_RELATIONS;

  constructor(@Inject(UsersService) private usersService: UsersService) {
    super();
  }

  @Query(() => User)
  async user(
    @IntArgs('id') id: number,
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
}
