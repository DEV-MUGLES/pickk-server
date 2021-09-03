import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { allSettled, isRejected, RejectResponse } from '@common/helpers';

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

  async tasklet(context: JobExecutionContext) {
    const sellerBrandIds = (
      await this.sellersRepository.find({ select: ['brandId'] })
    ).map(({ brandId }) => brandId);

    const sellerItemIds = (
      await this.itemsRepository.find({
        select: ['id'],
        where: {
          brandId: In(sellerBrandIds),
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

    const settledItemData = await allSettled(
      itemScoreDatas.map(
        ({ itemId, itemScore }) =>
          new Promise(async (resolve, reject) => {
            try {
              resolve(
                await this.itemsRepository.update(itemId, { score: itemScore })
              );
            } catch (err) {
              reject({ itemId, itemScore });
            }
          })
      )
    );

    const rejectedItems = [].concat(
      ...settledItemData
        .filter(isRejected)
        .map((v) => (v as RejectResponse).reason)
    );

    context.put('rejectedItems', rejectedItems);
  }
}
