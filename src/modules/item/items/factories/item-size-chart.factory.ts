import { BadRequestException } from '@nestjs/common';

import { CreateItemSizeChartInput } from '../dtos';
import { ItemSizeChart } from '../models';

export class ItemSizeChartFactory {
  static from(input: CreateItemSizeChartInput) {
    this.validate(input);

    return new ItemSizeChart({
      serializedLabels: JSON.stringify(input.labels),
      serializedSizes: JSON.stringify(input.sizes),
      serializedRecommendations: JSON.stringify(input.recommendations),
    });
  }

  static validate({
    labels,
    sizes,
    recommendations,
  }: CreateItemSizeChartInput) {
    if (!sizes.every(({ values }) => values.length === labels.length)) {
      throw new BadRequestException(
        'size value의 개수와 label의 개수가 일치하지 않습니다.'
      );
    }

    const sizeNames = sizes.map(({ name }) => name);
    if (
      recommendations &&
      !recommendations.every(({ sizeName }) => sizeNames.includes(sizeName))
    ) {
      throw new BadRequestException('사이즈 추천이 잘못되었습니다.');
    }
  }
}
