import { ItemInfoCrawlResult } from '@providers/crawler';

export class ProcessSellerItemsScrapResultMto {
  brandId: number;
  items: SellerItemsScrapResult[];
}

export class SellerItemsScrapResult extends ItemInfoCrawlResult {
  code: string;
}
