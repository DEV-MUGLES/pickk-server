import { Injectable } from '@nestjs/common';

import { BaseSearchService } from '@common/base.search.service';
import { SearchService } from '@providers/elasticsearch/provider.service';

import { IItem } from '@item/items/interfaces';
import { Item } from '@item/items/models';
import { ItemsService } from '@item/items/items.service';

export type ItemSearchBody = Pick<IItem, 'id' | 'name'> & {
  brandNameKor: string;
  minorCategoryName: string;
  isPurchasable: boolean;
};

@Injectable()
export class ItemSearchService extends BaseSearchService<Item, ItemSearchBody> {
  name = 'items_index';

  constructor(
    readonly searchService: SearchService,
    private readonly itemsService: ItemsService
  ) {
    super();
  }

  async getModel(id: number): Promise<Item> {
    return await this.itemsService.get(id, ['brand', 'minorCategory']);
  }

  toBody(item: Item): ItemSearchBody {
    return {
      id: item.id,
      name: item.name,
      brandNameKor: item.brand.nameKor,
      minorCategoryName: item.minorCategory?.name ?? '',
      isPurchasable: item.isPurchasable,
    };
  }
}
