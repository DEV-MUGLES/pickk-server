import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/user.input';
import { UserEntity } from './entities/user.entity';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Query(() => User)
  async user(@Args('id') id: number): Promise<UserEntity> {
    return await this.usersService.get(id);
  }

  @Query(() => [User])
  async users(): Promise<UserEntity[]> {
    return await this.usersService.list();
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserEntity> {
    return await this.usersService.create(createUserInput);
  }
}
