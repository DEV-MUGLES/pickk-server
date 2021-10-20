import { BadRequestException } from '@nestjs/common';

import { CreateItemSizeChartInput } from '../dtos';
import { ItemSizeChart } from '../models';

export class ItemSizeChartFactory {
  static from(input: CreateItemSizeChartInput) {
    this.validate(input);

    return new ItemSizeChart(input);
  }

  static validate({ labels, sizes }: CreateItemSizeChartInput) {
    if (!sizes.every(({ values }) => values.length === labels.length)) {
      throw new BadRequestException(
        'size value의 개수와 label의 개수가 일치하지 않습니다.'
      );
    }
  }
}
