import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { ItemRelationType, ITEM_RELATIONS } from '@item/items/constants';
import { Item } from '@item/items/models';
import { ItemsService } from '@item/items/items.service';
import { UserRole } from '@user/users/constants';

@Resolver(() => Item)
export class RootItemResolver extends BaseResolver<ItemRelationType> {
  relations = ITEM_RELATIONS;

  constructor(private readonly itemsService: ItemsService) {
    super();
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Item)
  async updateRootItemImageUrl(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateImageUrl(itemId);
    return await this.itemsService.get(itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async updateRootItemDetailImages(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateDetailImages(itemId);
    return await this.itemsService.get(itemId, ['detailImages']);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  @Mutation(() => Item)
  async updateRootItemByCrawl(
    @IntArgs('itemId') itemId: number
  ): Promise<Item> {
    await this.itemsService.updateByCrawl(itemId);
    return await this.itemsService.get(itemId, ['prices']);
  }
}
