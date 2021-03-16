import { Inject } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '@src/common/base.resolver';
import { GraphQLResolveInfo } from 'graphql';
import { CreateUserInput } from './dto/user.input';
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
}
