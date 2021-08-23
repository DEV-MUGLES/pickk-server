import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { ItemsRepository } from '@item/items/items.repository';
import { HitOwnerType } from '@mcommon/hits/constants';
import { HitsService } from '@mcommon/hits/hits.service';

@Injectable()
export class UpdateItemHitCountStep extends BaseStep {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository,
    private readonly hitsService: HitsService
  ) {
    super();
  }

  async tasklet(): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(HitOwnerType.Item);
    const itemIds = Object.keys(countMap);

    const items = await this.itemsRepository.findByIds(itemIds);
    items.forEach((item) => {
      item.hitCount += countMap[item.id];
    });

    await this.itemsRepository.save(items);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.Item);
  }
}
