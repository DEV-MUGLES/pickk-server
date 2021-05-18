import { EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { BaseRepository } from '@src/common/base.repository';

import { SizeChartEntity } from './entities/size-chart.entity';
import { SizeChart } from './model/size-chart.model';

@EntityRepository(SizeChartEntity)
export class SizeChartsRepository extends BaseRepository<
  SizeChartEntity,
  SizeChart
> {
  entityToModel(entity: SizeChartEntity, transformOptions = {}): SizeChart {
    return plainToClass(SizeChart, entity, transformOptions) as SizeChart;
  }

  entityToModelMany(
    entities: SizeChartEntity[],
    transformOptions = {}
  ): SizeChart[] {
    return entities.map((entity) =>
      this.entityToModel(entity, transformOptions)
    );
  }
}
