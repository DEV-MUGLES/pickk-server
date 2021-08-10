import { InfoCrawlResultDto } from '@providers/crawler/dtos';

export class ProcessSellerItemsScrapResultMto {
  brandId: number;
  items: SellerItemsScrapResult[];
}

export class SellerItemsScrapResult extends InfoCrawlResultDto {
  code: string;
}
