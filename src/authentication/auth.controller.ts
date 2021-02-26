import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { NameAuthGuard } from './guards/name-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return req.user;
  }

  @UseGuards(NameAuthGuard)
  @Post('/login-name')
  async loginByName(@Request() req) {
    return req.user;
  }
}
