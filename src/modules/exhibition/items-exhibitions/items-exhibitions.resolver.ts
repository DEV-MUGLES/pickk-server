import { Injectable } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

import { IntArgs } from '@common/decorators';
import { BaseResolver } from '@common/base.resolver';

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
}
