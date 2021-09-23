import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler, SqsProcess } from '@pickk/nestjs-sqs';

import { BaseConsumer } from '@common/base.consumer';
import { REMOVE_DIGESTS_QUEUE } from '@queue/constants';
import { RemoveDigestsMto } from '@queue/mtos';

import { DigestsProducer } from '../producers';
import { DigestsRepository } from '../digests.repository';

@SqsProcess(REMOVE_DIGESTS_QUEUE)
export class RemoveDigestsConsumer extends BaseConsumer {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    private readonly digestsProducer: DigestsProducer,
    readonly logger: Logger
  ) {
    super();
  }

  @SqsMessageHandler()
  async remove(message: AWS.SQS.Message) {
    const { ids }: RemoveDigestsMto = JSON.parse(message.Body);
    const digests = await this.digestsRepository.findByIds(ids);

    await this.digestsRepository.remove(digests);
    await this.digestsProducer.updateItemDigestStatistics(digests);
  }
}
