import { ItemCrawlResultDto } from '@providers/crawler/dtos';

export class ProcessSellerItemsScrapResultMto {
  brandId: number;
  items: SellerItemsScrapResult[];
}

export class SellerItemsScrapResult extends ItemCrawlResultDto {
  code: string;
}
