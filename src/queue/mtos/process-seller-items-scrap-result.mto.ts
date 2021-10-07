import { ItemInfoCrawlResult } from '@providers/crawler';

export class ProcessSellerItemsScrapResultMto {
  brandId: number;
  items: SellerItemsScrapResult[];
  pickkDiscountRate: number;
}

export class SellerItemsScrapResult extends ItemInfoCrawlResult {
  code: string;
}
