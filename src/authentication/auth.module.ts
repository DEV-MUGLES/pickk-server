import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtConstants } from './constants/jwt.constant';
import {
  JwtRefreshStrategy,
  JwtStrategy,
  JwtVerifyStrategy,
  JwtSellerStrategy,
} from './strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

import { UsersModule } from '@src/modules/user/users/users.module';
import { SellersModule } from '@src/modules/item/sellers/sellers.module';

@Module({
  imports: [
    UsersModule,
    SellersModule,
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
    JwtSellerStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
