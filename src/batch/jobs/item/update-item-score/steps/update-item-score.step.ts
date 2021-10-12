import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

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
    const sellerItemIds = (
      await this.itemsRepository.find({
        select: ['id'],
        where: {
          brandId: In(
            (
              await this.sellersRepository.find({ select: ['brandId'] })
            ).map(({ brandId }) => brandId)
          ),
          isPurchasable: true,
        },
      })
    ).map(({ id }) => id);

    if (sellerItemIds.length === 0) {
      return;
    }

    const itemScoreDatas = await this.digestsRepository
      .createQueryBuilder('digest')
      .leftJoin('digest.item', 'item')
      .select('SUM(digest.score) + 1', 'itemScore')
      .addSelect('digest.itemId', 'itemId')
      .addSelect('item.isSoldout', 'isSoldout')
      .where('digest.itemId IN (:itemIds)', { itemIds: sellerItemIds })
      .groupBy('digest.itemId')
      .getRawMany();

    for (const { itemId, itemScore, isSoldout } of itemScoreDatas) {
      await this.itemsRepository.update(itemId, {
        score: isSoldout ? itemScore : itemScore + 100,
      });
    }
  }
}
