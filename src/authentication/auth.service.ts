import { Injectable } from '@nestjs/common';
import { UsersService } from '@user/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@user/users/models/user.model';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { IJwtToken } from './interfaces/token.interface';
import { jwtRefreshConstants } from './constants/jwt.constant';

type ValidatedUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateEmail(
    email: string,
    password: string
  ): Promise<ValidatedUser | null> {
    const user = await this.usersService.findOne({ email });
    if (user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateCode(
    code: string,
    password: string
  ): Promise<ValidatedUser | null> {
    const user = await this.usersService.findOne({ code });
    if (user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
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
