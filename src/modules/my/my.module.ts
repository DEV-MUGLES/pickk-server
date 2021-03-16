import { Module } from '@nestjs/common';
import { UsersModule } from '../user/users/users.module';
import { MyResolver } from './my.resolver';

@Module({
  imports: [UsersModule],
  providers: [MyResolver],
})
export class MyModule {}
