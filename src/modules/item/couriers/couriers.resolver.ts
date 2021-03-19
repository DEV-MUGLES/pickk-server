import { Inject, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '@src/authentication/guards';

import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { Roles } from '@src/authentication/decorators/roles.decorator';
import { UserRole } from '@src/modules/user/users/constants/user.enum';
import { GraphQLResolveInfo } from 'graphql';
import { CouriersService } from './couriers.service';
import { Courier } from './models/courier.model';
import { CreateCourierInput, UpdateCourierInput } from './dto/courier.input';

@Resolver(() => Courier)
export class CouriersResolver extends BaseResolver {
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
}
