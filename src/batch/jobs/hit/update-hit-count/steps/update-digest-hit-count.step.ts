import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
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

  async tasklet(context: JobExecutionContext): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(
      HitOwnerType.Digest
    );
    const digestIds = Object.keys(countMap).map((id) => Number(id));

    const digests = await this.digestsRepository.findByIds(digestIds);
    const hitCountUpdatedDigests = digests.map(({ id, hitCount }) => ({
      id,
      hitCount: hitCount + Number(countMap[id]),
    }));

    await this.digestsRepository.save(hitCountUpdatedDigests);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.Digest);
    context.put('digest', hitCountUpdatedDigests);
  }
}
