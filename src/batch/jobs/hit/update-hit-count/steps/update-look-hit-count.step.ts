import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
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

  async tasklet(): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(HitOwnerType.Look);
    const lookIds = Object.keys(countMap).map((id) => Number(id));

    const looks = await this.looksRepository.findByIds(lookIds);
    looks.forEach((look) => {
      look.hitCount += Number(countMap[look.id]);
    });

    await this.looksRepository.save(looks);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.Look);
  }
}
