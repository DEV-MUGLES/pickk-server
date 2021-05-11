import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { SpiderConfigService } from '@src/config/providers/spider/config.service';
import { SellersService } from '@src/modules/item/sellers/sellers.service';
import { SpiderSellerRequestDto } from './interfaces/spider.interface';

@Injectable()
export class SpiderService {
  constructor(
    private readonly spiderConfigService: SpiderConfigService,
    private readonly sellersService: SellersService
  ) {}

  async requestSellers() {
    const sellers = await this.sellersService
      .list(null, null, ['brand', 'crawlPolicy', 'crawlStrategy'])
      .then((sellers) =>
        sellers.filter(({ crawlPolicy }) => crawlPolicy.isUpdatingItems)
      );

    const requestDtos: SpiderSellerRequestDto[] = sellers.map((seller) => {
      const { brand, crawlStrategy } = seller;
      const { baseUrl, startPathNamesJoin } = crawlStrategy;

      const startUrls = startPathNamesJoin
        .split('<>')
        .map((pathName) => baseUrl + pathName);

      return {
        brandId: brand.id,
        brandName: brand.nameKor,
        ...crawlStrategy,
        startUrls,
      };
    });

    const requestUrl = this.spiderConfigService.url + '/brands';
    await Promise.all(
      requestDtos.map((requestDto) => axios.post(requestUrl, requestDto))
    );
  }
}
