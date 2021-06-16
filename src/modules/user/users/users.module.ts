import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsS3ProviderModule } from '@providers/aws/s3';

import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersResolver } from './users.resolver';
import { PointsModule } from '@order/points/points.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    AwsS3ProviderModule,
    PointsModule,
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
