import { InfoCrawlResultDto } from '@providers/crawler/dtos';

class CrawlData extends InfoCrawlResultDto {
  brandId: number;
  code: string;
}

export class AddByCrawlDatasDto {
  datas: CrawlData[] = [];
}
