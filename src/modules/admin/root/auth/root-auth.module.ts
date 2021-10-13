import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';

import { SellersModule } from '@item/sellers/sellers.module';

import { RootAuthResolver } from './root-auth.resolver';

@Module({
  imports: [AuthModule, SellersModule],
  providers: [RootAuthResolver],
})
export class RootAuthModule {}
