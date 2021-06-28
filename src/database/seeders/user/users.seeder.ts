import faker from 'faker';
import { Injectable } from '@nestjs/common';

import { CreateUserInput } from '@user/users/dtos/user.input';
import { User } from '@user/users/models';
import { UsersService } from '@user/users/users.service';
import { genRandomNickname } from '@auth/helpers/auth.helper';
import { UserOauthProvider } from '@user/users/constants/user.enum';
import { USER_COUNT } from '../data';

@Injectable()
export class UsersSeeder {
  constructor(private usersService: UsersService) {}

  createUserInputs(): CreateUserInput[] {
    return [...Array(USER_COUNT)].map(() => ({
      code: faker.datatype.string(10),
      password: 'aaa111!!!',
      name: faker.name.firstName(),
      email: faker.internet.email(),
      nickname: genRandomNickname(),
      weight: faker.datatype.number({ min: 40, max: 110 }),
      height: faker.datatype.number({ min: 140, max: 200 }),
      oauthProvider: UserOauthProvider.Apple,
      oauthCode: faker.datatype.string(10),
    }));
  }

  async create(): Promise<User[]> {
    return await Promise.all(
      this.createUserInputs().map((userInput) =>
        this.usersService.create(userInput)
      )
    ).then((users) => users);
  }
}
