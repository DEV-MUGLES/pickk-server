import { ItemInfoCrawlResult } from '@providers/crawler/dtos';

export class ItemCrawlData extends ItemInfoCrawlResult {
  brandId: number;
  code: string;
}

export class AddByCrawlDatasDto {
  crawlDatas: ItemCrawlData[] = [];
}
