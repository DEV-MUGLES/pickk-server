import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/models/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateEmail(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateName(name: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ name });
    if (user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
