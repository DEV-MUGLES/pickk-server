import { ApiExtraModels } from '@nestjs/swagger';
import { ISellerCrawlStrategy } from '@item/sellers/interfaces/seller-crawl-strategy.interface';

import { SpiderItem } from '../models/spider-item.model';

export class SpiderSellerRequestDto
  implements Omit<ISellerCrawlStrategy, 'baseUrl' | 'startPathNamesJoin'> {
  itemsSelector: string;
  codeRegex: string;
  pagination: boolean;
  pageParam?: string;
  brandName: string;
  brandId: number;
  startUrls: string[];
}

@ApiExtraModels(SpiderItem)
export class SpiderSellerResultDto {
  brandName: string;
  brandId: number;
  codeRegex: string;
  items: SpiderItem[];
}
