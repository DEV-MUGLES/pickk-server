import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@common/dtos/pagination.dto';
import { parseFilter } from '@common/helpers/filter.helpers';

import { PointEventFilter } from './dtos/point-event.filter';
import { PointEvent } from './models/point-event.model';
import { PointEventsRepository } from './points.repository';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointEventsRepository)
    private readonly pointEventsRepository: PointEventsRepository
  ) {}

  async list(
    couponFilter?: PointEventFilter,
    pageInput?: PageInput
  ): Promise<PointEvent[]> {
    const _couponFilter = plainToClass(PointEventFilter, couponFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.pointEventsRepository.entityToModelMany(
      await this.pointEventsRepository.find({
        where: parseFilter(_couponFilter, pageInput?.idFilter),
        order: {
          id: 'DESC',
        },
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }
}
