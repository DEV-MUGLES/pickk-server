import { Injectable } from '@nestjs/common';

import { DigestsSearchService } from '@mcommon/search/digest.search.service';
import { DigestsService } from '@content/digests/digests.service';

@Injectable()
export class IndexDigestsStep {
  constructor(
    private readonly digestsService: DigestsService,
    private readonly digestSearchService: DigestsSearchService
  ) {}

  async tasklet() {
    const digests = await this.digestsService.list(
      { ratingIsNull: false } as any,
      null,
      ['item', 'item.brand', 'item.minorCategory', 'user']
    );
    await this.digestSearchService.bulkIndex(digests);

    const notHoneyDigests = await this.digestsService.list({
      ratingIsNull: true,
    } as any);
    await this.digestSearchService.bulkDelete(notHoneyDigests.map((v) => v.id));
  }
}
