import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Info,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/dtos';
import { JwtAuthGuard, JwtVerifyGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { UploadSingleImageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { PointsService } from '@order/points/points.service';
import { AwsS3ProviderService } from '@providers/aws/s3';

import { USER_RELATIONS } from './constants';
import { CreateUserInput, UpdateUserInput } from './dtos';
import { UserEntity } from './entities';
import { User, UserAvatarImage } from './models';

import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver extends BaseResolver {
  relations = USER_RELATIONS;

  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(PointsService) private pointsService: PointsService,
    @Inject(AwsS3ProviderService) private awsS3Service: AwsS3ProviderService
  ) {
    super();
  }

  @ResolveField(() => Int, {
    description: '[ResolveField] 사용가능 포인트 잔고',
  })
  async availablePoint(@Parent() user: User) {
    return await this.pointsService.getAvailableAmount(user.id);
  }

  @ResolveField(() => Int, {
    description: '[ResolveField] 적립예정 포인트 잔고',
  })
  async expectedPoint(@Parent() user: User) {
    return await this.pointsService.getExpectedAmount(user.id);
  }

  @Query(() => User)
  async user(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<UserEntity> {
    return await this.usersService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [User])
  async users(@Info() info?: GraphQLResolveInfo): Promise<UserEntity[]> {
    return await this.usersService.list(this.getRelationsFromInfo(info));
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput
  ): Promise<UserEntity> {
    return await this.usersService.create(createUserInput);
  }

  @Query(() => User)
  @UseGuards(JwtVerifyGuard)
  async me(
    @CurrentUser() payload: JwtPayload,
    @Info() info?: GraphQLResolveInfo
  ) {
    return await this.usersService.get(
      payload.sub,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => User)
  @UseGuards(JwtVerifyGuard)
  async updateMe(
    @CurrentUser() payload: JwtPayload,
    @Args('updateUserInput') updateUserInput: UpdateUserInput
  ): Promise<User> {
    return await this.usersService.update(payload.sub, { ...updateUserInput });
  }

  @Mutation(() => UserAvatarImage)
  @UseGuards(JwtAuthGuard)
  async updateMyAvatarImage(
    @CurrentUser() user: User,
    @Args('uploadSingleImageInput') { file }: UploadSingleImageInput
  ): Promise<UserAvatarImage> {
    const { filename, mimetype, createReadStream } = await file;
    const { key } = await this.awsS3Service.uploadStream(
      createReadStream(),
      filename,
      mimetype
    );
    return await this.usersService.updateAvatarImage(user, key);
  }

  @Mutation(() => UserAvatarImage)
  @UseGuards(JwtAuthGuard)
  async removeMyAvatarImage(
    @CurrentUser() user: User
  ): Promise<UserAvatarImage> {
    return await this.usersService.removeAvatarImage(user);
  }

  @Mutation(() => User, {
    description: '(!) 예전 비밀번호와 현재 비밀번호를 입력해주세요.',
  })
  @UseGuards(JwtAuthGuard)
  async updateMyPassword(
    @CurrentUser() user: User,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string
  ): Promise<User> {
    return await this.usersService.updatePassword(
      user,
      oldPassword,
      newPassword
    );
  }
}
