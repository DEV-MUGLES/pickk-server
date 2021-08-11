import { Injectable } from '@nestjs/common';

import { SellersService } from '@item/sellers/sellers.service';
import { SellerProducer } from '@item/sellers/producers';
import { BaseStep } from '@src/batch/jobs/base.step';

@Injectable()
export class ProduceScrapSellerItemsMessageStep extends BaseStep {
  constructor(
    private readonly sellersService: SellersService,
    private readonly sellerProducer: SellerProducer
  ) {
    super();
  }
  async tasklet() {
    await this.produceScrapSellerItemsMessage();
  }

  private async produceScrapSellerItemsMessage() {
    const sellers = await this.sellersService
      .list(null, null, ['brand', 'crawlPolicy', 'crawlStrategy'])
      .then((sellers) =>
        sellers.filter(({ crawlPolicy }) => crawlPolicy.isUpdatingItems)
      );

    for (const seller of sellers) {
      await this.sellerProducer.scrapSellerItems(seller);
    }
  }
}
