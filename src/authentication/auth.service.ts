import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserOauthProvider } from '@src/modules/user/users/constants/user.enum';
import { UserEntity } from '@src/modules/user/users/entities/user.entity';
import { User } from '@src/modules/user/users/models/user.model';
import { UsersService } from '@src/modules/user/users/users.service';

import { IJwtToken } from './interfaces/token.interface';
import { jwtRefreshConstants } from './constants/jwt.constant';
import { PasswordIncorrectException } from './exceptions/password-incorrect.exception';
import {
  UserCodeNotFoundExeption,
  UserOauthNotFoundExeption,
} from './exceptions/user.exception';
import { CreateJwtPayloadInput } from './dto/jwt.dto';

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
