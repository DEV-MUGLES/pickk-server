export interface ISellerCrawlInfo {
  itemsSelector: string;

  codeRegex: string;

  pagination: boolean;

  pageParam?: string;

  startUrls?: string[];
}
