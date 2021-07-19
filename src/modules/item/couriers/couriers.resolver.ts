import { Inject, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';
import { UserRole } from '@user/users/constants';

import {
  CreateCourierInput,
  UpdateCourierInput,
  UpdateCourierIssueInput,
} from './dtos';
import { Courier, CourierIssue } from './models';

import { CouriersService } from './couriers.service';

@Resolver(() => Courier)
export class CouriersResolver extends BaseResolver {
  relations = ['issue'];

  constructor(
    @Inject(CouriersService) private couriersService: CouriersService
  ) {
    super();
  }

  @Query(() => Courier)
  async courier(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Courier> {
    return await this.couriersService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Courier])
  async couriers(@Info() info?: GraphQLResolveInfo): Promise<Courier[]> {
    return await this.couriersService.list(this.getRelationsFromInfo(info));
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Courier)
  async createCourier(
    @Args('createCourierInput') createCourierInput: CreateCourierInput
  ): Promise<Courier> {
    return await this.couriersService.create(createCourierInput);
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Courier)
  async updateCourier(
    @IntArgs('id') id: number,
    @Args('updateCourierInput') updateCourierInput: UpdateCourierInput
  ): Promise<Courier> {
    return await this.couriersService.update(id, { ...updateCourierInput });
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => CourierIssue)
  async updateCourierIssue(
    @IntArgs('courierId') courierId: number,
    @Args('updateCourierIssueInput')
    updateCourierIssueInput: UpdateCourierIssueInput
  ): Promise<CourierIssue> {
    const courier = await this.couriersService.get(courierId);
    return await this.couriersService.updateIssue(
      courier,
      updateCourierIssueInput
    );
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Courier)
  async removeCourierIssue(
    @IntArgs('courierId') courierId: number
  ): Promise<Courier> {
    const courier = await this.couriersService.get(courierId, ['issue']);
    return await this.couriersService.removeIssue(courier);
  }
}
