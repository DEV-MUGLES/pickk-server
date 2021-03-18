import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UsersResolver } from './users.resolver';
import { ShippingAddressRepository } from './repositories/shipping-address.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, ShippingAddressRepository]),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
