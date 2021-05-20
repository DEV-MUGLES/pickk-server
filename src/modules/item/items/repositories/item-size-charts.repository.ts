import { EntityRepository, getConnection, In } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';
import { ItemSizeChartEntity } from '../entities/item-size-chart.entity';
import { ItemSizeChart } from '../models/item-size-chart.model';

@EntityRepository(ItemSizeChartEntity)
export class ItemSizeChartsRepository extends BaseRepository<
  ItemSizeChartEntity,
  ItemSizeChart
> {
  entityToModel(
    entity: ItemSizeChartEntity,
    transformOptions = {}
  ): ItemSizeChart {
    return plainToClass(
      ItemSizeChart,
      entity,
      transformOptions
    ) as ItemSizeChart;
  }

  entityToModelMany(
    entities: ItemSizeChartEntity[],
    transformOptions = {}
  ): ItemSizeChart[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(ItemSizeChartEntity)
      .where({ id: In(ids) })
      .execute();
  }
}
