import { Injectable } from '@nestjs/common';
import { UsersService } from '@src/modules/user/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@src/modules/user/users/entities/user.entity';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { IJwtToken } from './interfaces/token.interface';
import { jwtRefreshConstants } from './constants/jwt.constant';
import { User } from '@src/modules/user/users/models/user.model';
import { PasswordIncorrectException } from './exceptions/password-incorrect.exception';
import {
  UserCodeNotFoundExeption,
  UserEmailNotFoundExeption,
} from './exceptions/user-not-found.exception';

type ValidatedUser = Omit<UserEntity, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async getUserByEmailAuth(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new UserEmailNotFoundExeption();
    }

    if (user.comparePassword(password)) {
      delete user.password;
      return user;
    } else {
      throw new PasswordIncorrectException();
    }
  }

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

  getToken(user: ValidatedUser): IJwtToken {
    const payload: IJwtPayload = {
      username: user.name,
      code: user.code,
      sub: user.id,
    };
    return {
      access: this.jwtService.sign(payload),
      refresh: this.jwtService.sign(payload, jwtRefreshConstants),
    };
  }
}
