import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
import { LooksRepository } from '@content/looks/looks.repository';
import { HitOwnerType } from '@mcommon/hits/constants';
import { HitsService } from '@mcommon/hits/hits.service';

@Injectable()
export class UpdateLookHitCountStep extends BaseStep {
  constructor(
    @InjectRepository(LooksRepository)
    private readonly looksRepository: LooksRepository,
    private readonly hitsService: HitsService
  ) {
    super();
  }

  async tasklet(context: JobExecutionContext): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(HitOwnerType.Look);
    const digestIds = Object.keys(countMap).map((id) => Number(id));

    const looks = await this.looksRepository.findByIds(digestIds);
    const hitCountUpdatedLooks = looks.map(({ id, hitCount }) => ({
      id,
      hitCount: hitCount + Number(countMap[id]),
    }));

    await this.looksRepository.save(hitCountUpdatedLooks);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.Look);
    context.put('look', hitCountUpdatedLooks);
  }
}
