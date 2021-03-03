import { Inject } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
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
}
