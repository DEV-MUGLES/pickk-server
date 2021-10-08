import { Injectable } from '@nestjs/common';

import { ItemSearchService } from '@mcommon/search/item.search.service';
import { ItemsService } from '@item/items/items.service';

@Injectable()
export class IndexItemsStep {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly itemSearchService: ItemSearchService
  ) {}

  async tasklet() {
    const items = await this.itemsService.list(null, null, [
      'brand',
      'minorCategory',
    ]);

    await this.itemSearchService.bulkIndex(items);
  }
}
