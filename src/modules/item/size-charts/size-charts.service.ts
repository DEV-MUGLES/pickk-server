import { Inject, Injectable } from '@nestjs/common';
import { SizeChartsRepository } from './size-charts.repository';

@Injectable()
export class SizeChartsService {
  constructor(
    @Inject(SizeChartsRepository)
    private sizeChartsRepository: SizeChartsRepository
  ) {}
}
