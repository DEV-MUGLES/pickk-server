import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { DigestsRepository } from '@content/digests/digests.repository';
import { HitOwnerType } from '@mcommon/hits/constants';
import { HitsService } from '@mcommon/hits/hits.service';

@Injectable()
export class UpdateDigestHitCountStep extends BaseStep {
  constructor(
    @InjectRepository(DigestsRepository)
    private readonly digestsRepository: DigestsRepository,
    private readonly hitsService: HitsService
  ) {
    super();
  }

  async tasklet(): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(
      HitOwnerType.DIGEST
    );
    const digestIds = Object.keys(countMap);

    const digests = await this.digestsRepository.findByIds(digestIds);
    digests.forEach((digest) => {
      digest.hitCount += countMap[digest.id];
    });

    await this.digestsRepository.save(digests);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.DIGEST);
  }
}
