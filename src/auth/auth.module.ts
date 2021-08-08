import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@user/users/users.module';
import { SellersModule } from '@item/sellers/sellers.module';
import { AppleProviderModule } from '@providers/apple';

import { jwtConstants } from './constants';
import {
  RefreshStrategy,
  LocalStrategy,
  VerifyStrategy,
  SellerStrategy,
} from './strategies';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    SellersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    AppleProviderModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    VerifyStrategy,
    RefreshStrategy,
    SellerStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
