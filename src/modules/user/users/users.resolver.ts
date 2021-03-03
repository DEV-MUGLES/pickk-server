import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Query(() => User)
  async user(@Args('id') id: number): Promise<User> {
    return await this.usersService.get(id);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return await this.usersService.list();
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserInput
  ): Promise<User> {
    return await this.usersService.create(createUserDto);
  }
}
