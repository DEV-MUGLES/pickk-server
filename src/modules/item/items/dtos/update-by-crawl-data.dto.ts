import { Item } from '../models';

import { InfoCrawlResultDto } from '@providers/crawler/dtos';

class UpdateItemData {
  item: Item;
  data: InfoCrawlResultDto;
}

export class UpdateByCrawlDatasDto {
  datas: UpdateItemData[] = [];
}
