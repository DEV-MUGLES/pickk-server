import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { CampaignEntity } from './entities';
import { Campaign } from './models';

@EntityRepository(CampaignEntity)
export class CampaignsRepository extends BaseRepository<
  CampaignEntity,
  Campaign
> {
  entityToModel(entity: CampaignEntity, transformOptions = {}): Campaign {
    return plainToClass(Campaign, entity, transformOptions) as Campaign;
  }

  entityToModelMany(
    entities: CampaignEntity[],
    transformOptions = {}
  ): Campaign[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
