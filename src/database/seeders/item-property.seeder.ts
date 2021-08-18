import { Injectable } from '@nestjs/common';

import { ItemPropertiesRepository } from '@item/item-properties/item-properties.repository';
import { ItemProperty, ItemPropertyValue } from '@item/item-properties/models';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class ItemPropertySeeder extends BaseSeeder {
  constructor(
    private readonly itemPropertiesRepository: ItemPropertiesRepository
  ) {
    super();
  }

  async seed(): Promise<void> {
    const itemProperties = [];

    ITEM_PROPERTY_SEED_DATA.forEach((data) => {
      const { minorCategoryId, props } = data;
      props.forEach((p) => {
        const { name, values } = p;
        const itemPropertyValues = values.map(
          (v, i) => new ItemPropertyValue({ name: v, order: i })
        );

        itemProperties.push(
          new ItemProperty({
            minorCategoryId,
            name,
            values: itemPropertyValues,
          })
        );
      });
    });

    await this.itemPropertiesRepository.save(itemProperties);
  }
}

const ITEM_PROPERTY_SEED_DATA: {
  minorCategoryId: number;
  props: { name: string; values: string[] }[];
}[] = [
  {
    minorCategoryId: 63,
    props: [
      { name: '소', values: ['램스킨', '비건레더', '카우스킨', 'abc'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 64,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 65,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 66,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 67,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 68,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 69,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 70,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 71,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 72,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 73,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },

  {
    minorCategoryId: 74,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 75,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },

  {
    minorCategoryId: 76,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 77,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 78,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 79,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 80,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 81,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 82,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 83,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },

  {
    minorCategoryId: 84,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 85,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },

  {
    minorCategoryId: 86,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 87,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 88,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 89,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 90,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 91,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 92,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 93,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },

  {
    minorCategoryId: 94,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 95,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },

  {
    minorCategoryId: 96,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 97,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 98,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 99,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
  {
    minorCategoryId: 100,
    props: [
      { name: '소재', values: ['램스킨', '비건레더', '카우스킨'] },
      { name: '핏', values: ['오버핏', '스탠다드핏', '슬림핏'] },
      { name: '기장', values: ['짧음', '보통', '김'] },
    ],
  },
];
