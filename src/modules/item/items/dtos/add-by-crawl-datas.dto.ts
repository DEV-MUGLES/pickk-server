import { ItemCrawlResultDto } from '@providers/crawler/dtos';

export class ItemCrawlData extends ItemCrawlResultDto {
  brandId: number;
  code: string;
}

export class AddByCrawlDatasDto {
  crawlDatas: ItemCrawlData[] = [];
}
