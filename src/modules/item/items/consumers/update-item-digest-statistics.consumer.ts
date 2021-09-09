import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { DigestsRepository } from '@content/digests/digests.repository';
import { UPDATE_ITEM_DIGEST_STATISTICS_QUEUE } from '@queue/constants';
import { UpdateItemDigestStatisticsMto } from '@queue/mtos';

import { ItemsRepository } from '../items.repository';

type DigestStatistic = {
  itemId: number;
  count: number;
  averageRating: number;
};

@SqsProcess(UPDATE_ITEM_DIGEST_STATISTICS_QUEUE)
export class UpdateItemDigestStatisticsConsumer {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository
  ) {}

  @SqsMessageHandler(true)
  async updateDigestStatistics(messages: AWS.SQS.Message[]) {
    const itemIds = messages
      .map(({ Body }) => JSON.parse(Body) as UpdateItemDigestStatisticsMto)
      .map(({ itemId }) => itemId);

    const digestStatistics = await this.digestsRepository
      .createQueryBuilder()
      .select('COUNT(itemId)', 'count')
      .addSelect('AVG(rating)', 'averageRating')
      .addSelect('itemId')
      .where('itemId In(:itemIds)', { itemIds })
      .andWhere('rating IS NOT NULL')
      .groupBy('itemId')
      .getRawMany<DigestStatistic>();

    await Promise.all(
      digestStatistics.map(({ itemId, count, averageRating }) =>
        this.itemsRepository.update(itemId, {
          digestCount: count,
          digestAverageRating: averageRating,
        })
      )
    );
  }
}
