import { Injectable } from '@nestjs/common';
import { UsersService } from '@src/models/user/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@src/models/user/users/entities/user.entity';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { IJwtToken } from './interfaces/token.interface';
import { jwtRefreshConstants } from './constants/jwt.constant';

type ValidatedUser = Omit<UserEntity, 'password'>;

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
    const { password: _password, ...result } = user;
    return result;
  }

  async validateCode(
    code: string,
    password: string
  ): Promise<ValidatedUser | null> {
    const user = await this.usersService.findOne({ code });
    const { password: _password, ...result } = user;
    return result;
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
