import { ISellerCrawlStrategy } from '@item/sellers/interfaces/seller-crawl-strategy.interface';
import { ISpiderItem } from '../interfaces/spider.interface';

export class SpiderSellerRequestDto
  implements Omit<ISellerCrawlStrategy, 'baseUrl' | 'startPathNamesJoin'>
{
  itemsSelector: string;
  codeRegex: string;
  pagination: boolean;
  pageParam?: string;
  brandName: string;
  brandId: number;
  startUrls: string[];
}

export class SpiderSellerResultDto {
  brandName: string;
  brandId: number;
  codeRegex: string;
  items: SpiderItem[];
}

export class SpiderItem implements ISpiderItem {
  name: string;
  brandKor: string;
  imageUrl: string;
  originalPrice: number;
  salePrice: number;
  isSoldout?: boolean;
  images?: string[];
  url: string;
}
