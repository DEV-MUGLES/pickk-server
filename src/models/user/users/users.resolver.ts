import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/user.input';
import { UserEntity } from './entities/user.entity';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Query(() => UserModel)
  async user(@Args('id') id: number): Promise<UserEntity> {
    return await this.usersService.get(id);
  }

  @Query(() => [UserModel])
  async users(): Promise<UserEntity[]> {
    return await this.usersService.list();
  }

  @Mutation(() => UserModel)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserEntity> {
    return await this.usersService.create(createUserInput);
  }
}
