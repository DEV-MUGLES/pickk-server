import { Item } from '../models';

import { ItemCrawlResultDto } from '@providers/crawler/dtos';

export class UpdateItemData {
  item: Item;
  itemData: Partial<ItemCrawlResultDto>;
}

export class UpdateByCrawlDatasDto {
  updateItemDatas: UpdateItemData[] = [];
}
