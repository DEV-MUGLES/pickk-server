import { BadRequestException } from '@nestjs/common';

import { CreateItemSizeChartInput } from '../dtos';
import { ItemSizeChart } from '../models';

export class ItemSizeChartFactory {
  static from(input: CreateItemSizeChartInput) {
    this.checkInputValidation(input);

    return new ItemSizeChart({
      serializedLabels: JSON.stringify(input.labels),
      serializedSizes: JSON.stringify(input.sizes),
      serializedRecommedations: JSON.stringify(input.recommedations),
    });
  }

  static checkInputValidation({
    labels,
    sizes,
    recommedations,
  }: CreateItemSizeChartInput) {
    if (!sizes.every(({ values }) => values.length === labels.length)) {
      throw new BadRequestException('size와 label의 개수가 일치하지 않습니다.');
    }

    const sizeNames = sizes.map(({ name }) => name);
    if (
      recommedations &&
      !recommedations.every(({ sizeName }) => sizeNames.includes(sizeName))
    ) {
      throw new BadRequestException('사이즈 추천이 잘못되었습니다.');
    }
  }
}
