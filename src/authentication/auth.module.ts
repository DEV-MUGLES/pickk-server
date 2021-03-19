import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtConstants } from './constants/jwt.constant';
import {
  JwtRefreshStrategy,
  JwtStrategy,
  JwtVerifyStrategy,
} from './strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

import { UsersModule } from '@src/modules/user/users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    JwtVerifyStrategy,
    JwtRefreshStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
