import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { ItemsExhibitionRelationType } from '@exhibition/items-exhibitions/constants';
import {
  CreateItemsExhibitionInput,
  UpdateItemsExhibitionInput,
} from '@exhibition/items-exhibitions/dtos';
import { ItemsExhibition } from '@exhibition/items-exhibitions/models';
import { ItemsExhibitionsService } from '@exhibition/items-exhibitions/items-exhibitions.service';
import { UserRole } from '@user/users/constants';

@Resolver(() => ItemsExhibition)
export class RootItemsExhibitionResolver extends BaseResolver<ItemsExhibitionRelationType> {
  constructor(
    private readonly itemsExhibitionsService: ItemsExhibitionsService
  ) {
    super();
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ItemsExhibition)
  async createRootItemsExhibition(
    @Args('input') input: CreateItemsExhibitionInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemsExhibition> {
    const { id } = await this.itemsExhibitionsService.create(input);

    return await this.itemsExhibitionsService.get(
      id,
      this.getRelationsFromInfo(info)
    );
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ItemsExhibition)
  async updateRootItemsExhibition(
    @IntArgs('id') id: number,
    @Args('input') input: UpdateItemsExhibitionInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemsExhibition> {
    if (input) {
      await this.itemsExhibitionsService.update(id, input);
    }
    if (input.itemIds) {
      await this.itemsExhibitionsService.updateItems(id, input.itemIds);
    }

    return await this.itemsExhibitionsService.get(
      id,
      this.getRelationsFromInfo(info)
    );
  }
}
