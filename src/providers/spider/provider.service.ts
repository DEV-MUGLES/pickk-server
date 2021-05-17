import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { SpiderConfigService } from '@src/config/providers/spider/config.service';
import { SellersService } from '@item/sellers/sellers.service';
import { ItemsService } from '@item/items/items.service';

import {
  SpiderSellerRequestDto,
  SpiderSellerResultDto,
} from './dto/spider.dto';
import { splitRegexString } from './helpers/spider.helper';

@Injectable()
export class SpiderService {
  constructor(
    private readonly spiderConfigService: SpiderConfigService,
    private readonly sellersService: SellersService,
    private readonly itemsService: ItemsService
  ) {}

  async requestSellers(): Promise<number> {
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
    return requestDtos.length;
  }

  async processSellerResult(sellerResult: SpiderSellerResultDto) {
    const { brandId, codeRegex, items } = sellerResult;

    for (const itemData of items) {
      const [, code] = itemData.url.match(
        new RegExp(...splitRegexString(codeRegex))
      );

      const item = await this.itemsService.findOne(
        {
          providedCode: code,
          brandId,
        },
        ['prices']
      );
      if (!item) {
        // @TODO: 추가된 item들에 대해서 썸네일 이미지 업로드를 진행하고, 업데이트 해야함
        await this.itemsService.addByCrawlData(brandId, code, itemData);
        continue;
      }

      await this.itemsService.updateByCrawlData(item, itemData);
    }
  }
}
