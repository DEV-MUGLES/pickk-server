import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/models/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/models/users/serializers/user.serializer';

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
    if (user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateName(
    name: string,
    password: string
  ): Promise<ValidatedUser | null> {
    const user = await this.usersService.findOne({ name });
    if (user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: ValidatedUser) {
    const payload = { username: user.name, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
