import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/user.input';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Query(() => UserEntity)
  async user(@Args('id') id: number): Promise<UserEntity> {
    return await this.usersService.get(id);
  }

  @Query(() => [UserEntity])
  async users(): Promise<UserEntity[]> {
    return await this.usersService.list();
  }

  @Mutation(() => UserEntity)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserEntity> {
    return await this.usersService.create(createUserInput);
  }
}
