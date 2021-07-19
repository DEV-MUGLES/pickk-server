import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserOauthProvider } from '@user/users/constants';
import { UserEntity } from '@user/users/entities';
import { User } from '@user/users/models';
import { UsersService } from '@user/users/users.service';

import { jwtRefreshConstants } from './constants';
import { CreateJwtPayloadInput } from './dtos';
import {
  PasswordIncorrectException,
  UserCodeNotFoundExeption,
  UserOauthNotFoundExeption,
} from './exceptions';
import { IJwtToken } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async getUserByCodeAuth(
    code: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersService.findOne({ code });
    if (!user) {
      throw new UserCodeNotFoundExeption();
    }

    if (user.comparePassword(password)) {
      delete user.password;
      return user;
    } else {
      throw new PasswordIncorrectException();
    }
  }

  async getUserByOauth(
    oauthProvider: UserOauthProvider,
    oauthCode: string
  ): Promise<User | null> {
    const user = await this.usersService.findOne({ oauthProvider, oauthCode });
    if (!user) {
      throw new UserOauthNotFoundExeption();
    }

    delete user.password;
    return user;
  }

  getToken(user: Pick<UserEntity, 'id' | 'nickname'>): IJwtToken {
    const payload: CreateJwtPayloadInput = {
      nickname: user.nickname,
      sub: user.id,
    };
    return {
      access: this.jwtService.sign(payload),
      refresh: this.jwtService.sign(payload, jwtRefreshConstants),
    };
  }
}
