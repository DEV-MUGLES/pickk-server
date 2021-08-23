import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { JobExecutionContext } from '@batch/models';
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

  async tasklet(context: JobExecutionContext): Promise<void> {
    const countMap = await this.hitsService.getOwnerCountMap(HitOwnerType.Item);
    const itemIds = Object.keys(countMap).map((id) => Number(id));

    const items = await this.itemsRepository.findByIds(itemIds);
    const hitCountUpdatedItems = items.map(({ id, hitCount }) => ({
      id,
      hitCount: hitCount + Number(countMap[id]),
    }));

    await this.itemsRepository.save(hitCountUpdatedItems);
    await this.hitsService.clearOwnerCountMap(HitOwnerType.Item);
    context.put('items', hitCountUpdatedItems);
  }
}
