import faker from 'faker';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from '@user/users/dtos/user.input';
import { User } from '@user/users/models';
import { UsersService } from '@user/users/users.service';
import { genRandomNickname } from '@auth/helpers/auth.helper';
import { UserOauthProvider } from '@user/users/constants/user.enum';

@Injectable()
export class UsersSeeder {
  constructor(private usersService: UsersService) {}

  async create(): Promise<User> {
    const createInput: CreateUserInput = {
      code: faker.datatype.string(10),
      password: 'aaa111!!!',
      name: faker.name.firstName(),
      email: faker.internet.email(),
      nickname: genRandomNickname(),
      weight: faker.datatype.number({ min: 40, max: 110 }),
      height: faker.datatype.number({ min: 140, max: 200 }),
      oauthProvider: UserOauthProvider.Apple,
      oauthCode: faker.datatype.string(10),
    };
    return await this.usersService.create(createInput);
  }
}
