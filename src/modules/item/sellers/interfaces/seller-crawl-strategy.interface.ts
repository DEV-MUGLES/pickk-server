export interface ISellerCrawlStrategy {
  itemsSelector: string;

  codeRegex: string;

  pagination: boolean;

  pageParam: string;

  baseUrl: string;

  /** spliter: "<>" */
  startPathNamesJoin: string;
}
