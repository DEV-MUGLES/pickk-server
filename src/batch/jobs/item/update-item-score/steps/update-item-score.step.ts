import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { DigestsRepository } from '@content/digests/digests.repository';
import { ItemsRepository } from '@item/items/items.repository';
import { SellersRepository } from '@item/sellers/sellers.repository';

@Injectable()
export class UpdateItemScoreStep extends BaseStep {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository,
    @InjectRepository(SellersRepository)
    private readonly sellersRepository: SellersRepository
  ) {
    super();
  }

  async tasklet() {
    const sellerBrandIds = (
      await this.sellersRepository.find({ select: ['brandId'] })
    ).map(({ brandId }) => brandId);

    const sellerItemIds = (
      await this.itemsRepository.find({
        select: ['id'],
        where: {
          brandId: In(sellerBrandIds),
          isPurchasable: true,
        },
      })
    ).map(({ id }) => id);

    const itemScoreDatas = await this.digestsRepository
      .createQueryBuilder('digest')
      .select('SUM(digest.score)', 'itemScore')
      .addSelect('digest.itemId', 'itemId')
      .where('digest.itemId IN (:itemIds)', { itemIds: sellerItemIds })
      .groupBy('digest.itemId')
      .getRawMany();

    for (const { itemId, itemScore } of itemScoreDatas) {
      await this.itemsRepository.update(itemId, { score: itemScore });
    }

    const resetIds = (
      await this.itemsRepository.find({
        select: ['id'],
        where: {
          isPurchasable: false,
          score: Not(0),
        },
      })
    ).map(({ id }) => id);

    for (const resetId of resetIds) {
      await this.itemsRepository.update(resetId, { score: 0 });
    }
  }
}
