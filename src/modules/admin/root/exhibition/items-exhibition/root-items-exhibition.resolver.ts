import { UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

import { ItemsExhibitionRelationType } from '@exhibition/items-exhibitions/constants';
import { UpdateItemsExhibitionInput } from '@exhibition/items-exhibitions/dtos';
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
  async updateRootItemsExhibition(
    @IntArgs('id') id: number,
    @Args('input', { nullable: true }) input: UpdateItemsExhibitionInput,
    @Args('itemIds', { type: () => [Int], nullable: true }) itemIds: number[],
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemsExhibition> {
    if (input) {
      await this.itemsExhibitionsService.update(id, input);
    }
    if (itemIds) {
      await this.itemsExhibitionsService.updateItems(id, itemIds);
    }

    return await this.itemsExhibitionsService.get(
      id,
      this.getRelationsFromInfo(info)
    );
  }
}
