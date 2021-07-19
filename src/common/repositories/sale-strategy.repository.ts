import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@common/base.repository';

import { SaleStrategyEntity } from '../entities';
import { SaleStrategy } from '../models';

@EntityRepository(SaleStrategyEntity)
export class SaleStrategyRepository extends BaseRepository<
  SaleStrategyEntity,
  SaleStrategy
> {
  async findOrCreate(
    param: Pick<SaleStrategyEntity, 'canUseCoupon' | 'canUseMileage'>
  ): Promise<SaleStrategy> {
    const saleStrategy = await this.findOneEntity(param);
    return saleStrategy ?? (await this.createEntity(param));
  }

  entityToModel(
    entity: SaleStrategyEntity,
    transformOptions = {}
  ): SaleStrategy {
    return plainToClass(SaleStrategy, entity, transformOptions) as SaleStrategy;
  }

  entityToModelMany(
    entities: SaleStrategyEntity[],
    transformOptions = {}
  ): SaleStrategy[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
