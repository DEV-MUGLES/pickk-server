import { Int, Query, Resolver } from '@nestjs/graphql';

import { IntArgs } from '@common/decorators';

import { ItemsGroup } from './models';

import { ItemsGroupsService } from './items-groups.service';

@Resolver(() => ItemsGroup)
export class ItemsGroupsResolver {
  constructor(private readonly itemsGroupsService: ItemsGroupsService) {}

  @Query(() => [Int], { nullable: true })
  async groupItemIds(@IntArgs('itemId') itemId: number): Promise<number[]> {
    return await this.itemsGroupsService.findGroupItemIds(itemId);
  }
}
