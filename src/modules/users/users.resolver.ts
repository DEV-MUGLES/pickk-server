import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(@Inject(UsersService) private usersService: UsersService) {}

  @Query((returns) => User)
  async user(@Args('id') id: number): Promise<User> {
    return await this.usersService.get(id);
  }

  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return await this.usersService.list();
  }

  @Mutation((returns) => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto
  ): Promise<User> {
    return await this.usersService.create(createUserDto);
  }
}
