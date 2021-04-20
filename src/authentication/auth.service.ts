import { Injectable } from '@nestjs/common';
import { UsersService } from '@src/modules/user/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@src/modules/user/users/entities/user.entity';
import { IJwtToken } from './interfaces/token.interface';
import { jwtRefreshConstants } from './constants/jwt.constant';
import { User } from '@src/modules/user/users/models/user.model';
import { PasswordIncorrectException } from './exceptions/password-incorrect.exception';
import { UserCodeNotFoundExeption } from './exceptions/user.exception';
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

  getToken(user: Pick<UserEntity, 'id' | 'name' | 'code'>): IJwtToken {
    const payload: CreateJwtPayloadInput = {
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
