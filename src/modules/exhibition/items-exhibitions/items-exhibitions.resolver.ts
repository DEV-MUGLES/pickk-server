import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { UserRole } from '@user/users/constants';

import {
  ItemsExhibitionRelationType,
  ITEMS_EXHIBITION_RELATIONS,
} from './constants';
import { ItemsExhibition } from './models';

import { ItemsExhibitionsService } from './items-exhibitions.service';

@Injectable()
export class ItemsExhibitionsResolver extends BaseResolver<ItemsExhibitionRelationType> {
  relations = ITEMS_EXHIBITION_RELATIONS;

  constructor(
    private readonly itemsExhibitionsService: ItemsExhibitionsService
  ) {
    super();
  }

  @Query(() => ItemsExhibition)
  async itemsExhibition(@IntArgs('id') id: number): Promise<ItemsExhibition> {
    return await this.itemsExhibitionsService.get(id, this.relations);
  }

  @Query(() => [ItemsExhibition])
  async itemsExhibitions(): Promise<ItemsExhibition[]> {
    return await this.itemsExhibitionsService.list(this.relations);
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ItemsExhibition)
  async updateItemsExhibitionItems(
    @IntArgs('id') id: number,
    @Args('itemIds', { type: () => [Int] }) itemIds: number[],
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemsExhibition> {
    await this.itemsExhibitionsService.updateItems(id, itemIds);

    return await this.itemsExhibitionsService.get(
      id,
      this.getRelationsFromInfo(info)
    );
  }
}
