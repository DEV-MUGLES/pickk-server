import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class NameStrategy extends PassportStrategy(Strategy, 'name') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'name',
    });
  }

  async validate(name: string, password: string): Promise<any> {
    const user = await this.authService.validateName(name, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
