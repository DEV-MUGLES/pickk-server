import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@user/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';
import { JwtStrategy, JwtVerifyStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, JwtVerifyStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
