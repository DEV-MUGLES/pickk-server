import { Item } from '../models';

import { ItemInfoCrawlResult } from '@providers/crawler/dtos';

export class UpdateItemData {
  item: Item;
  itemData: ItemInfoCrawlResult;
}

export class UpdateByCrawlDatasDto {
  updateItemDatas: UpdateItemData[] = [];
}
