import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { KeywordsRepository } from '@content/keywords/keywords.repository';
import { HitOwnerType } from '@mcommon/hits/constants';
import { HitsService } from '@mcommon/hits/hits.service';

@Injectable()
export class UpdateKeywordHitCountStep extends BaseStep {
  constructor(
    @InjectRepository(KeywordsRepository)
    private readonly keywordsRepository: KeywordsRepository,
    private readonly hitsService: HitsService
  ) {
    super();
  }

  async tasklet(): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(
      HitOwnerType.Keyword
    );
    const keywordIds = Object.keys(countMap);

    const keywords = await this.keywordsRepository.findByIds(keywordIds);
    keywords.forEach((keyword) => {
      keyword.hitCount += countMap[keyword.id];
    });

    await this.keywordsRepository.save(keywords);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.Keyword);
  }
}
