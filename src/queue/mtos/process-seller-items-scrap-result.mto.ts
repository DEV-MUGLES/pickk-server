import { InfoCrawlResultDto } from '@providers/crawler/dtos';

export class ProcessSellerItemsScrapResultMto {
  brandId: number;
  codeRegex: string;
  items: InfoCrawlResultDto[];
}
