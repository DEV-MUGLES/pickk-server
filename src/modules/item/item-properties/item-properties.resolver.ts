import { Inject, Injectable } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { ItemPropertyRelationType, ITEM_PROPERTY_RELATIONS } from './constants';
import { ItemPropertyFilter } from './dtos';
import { ItemProperty } from './models';

import { ItemPropertiesService } from './item-properties.service';

@Injectable()
export class ItemPropertiesResolver extends BaseResolver<ItemPropertyRelationType> {
  relations = ITEM_PROPERTY_RELATIONS;

  constructor(
    @Inject(ItemPropertiesService)
    private readonly itemPropertiesService: ItemPropertiesService
  ) {
    super();
  }

  @Query(() => [ItemProperty])
  async itemProperties(
    @Args('itemPropertyFilter', { nullable: true })
    filter?: ItemPropertyFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemProperty[]> {
    return await this.itemPropertiesService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }
}
