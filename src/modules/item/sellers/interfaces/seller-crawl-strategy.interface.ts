export interface ISellerCrawlStrategy {
  itemLinksSelector: string;

  baseUrl: string;
  startPathNamesJoin: string;
}
