import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as faker from 'faker';

import {
  CreateItemOptionSetInput,
  AddItemPriceInput,
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
  AddItemUrlInput,
} from '../dtos';

import { ItemOption } from './item-option.model';
import { ItemPrice } from './item-price.model';
import { ItemSizeChart } from './item-size-chart.model';
import { Item } from './item.model';

describe('Item', () => {
  describe('addUrl', () => {
    const addItemUrlInput: AddItemUrlInput = {
      url: faker.internet.url(),
      isPrimary: true,
    };

    it('추가된 URL을 반환한다.', () => {
      const item = new Item();
      const result = item.addUrl(addItemUrlInput);
      expect(result).toMatchObject(addItemUrlInput);
    });

    it('첫번째 URL은 Primary로 설정된다.', () => {
      addItemUrlInput.isPrimary = false;
      const item = new Item();
      const result = item.addUrl(addItemUrlInput);
      expect(result).toMatchObject({
        ...addItemUrlInput,
        isPrimary: true,
      });
    });
  });

  describe('addPrice', () => {
    const [sellPrice, originalPrice] = [
      faker.datatype.number(),
      faker.datatype.number(),
    ].sort((a, b) => a - b);

    const addItemPriceInput: AddItemPriceInput = {
      originalPrice,
      sellPrice,
      isCrawlUpdating: true,
    };

    it('추가된 Price를 반환한다.', () => {
      const item = new Item();
      const result = item.addPrice(addItemPriceInput);
      expect(result).toMatchObject(addItemPriceInput);
    });

    it('처음으로 추가된 Price는 Base이며, Active 상태다.', () => {
      const item = new Item();
      const result = item.addPrice(addItemPriceInput);
      expect(result.isActive).toEqual(true);
      expect(result.isBase).toEqual(true);
    });

    it('isActive가 true면 기존 Price들을 비활성화한다.', () => {
      const item = new Item({
        prices: [
          new ItemPrice(addItemPriceInput),
          new ItemPrice(addItemPriceInput),
        ],
      });
      item.addPrice(addItemPriceInput);
      expect(item.prices[0].isActive).toEqual(false);
      expect(item.prices[1].isActive).toEqual(false);
    });
  });

  describe('removePrice', () => {
    const [sellPrice, originalPrice] = [
      faker.datatype.number(),
      faker.datatype.number(),
      faker.datatype.number(),
    ].sort((a, b) => a - b);

    const addItemPriceInput: AddItemPriceInput = {
      originalPrice,
      sellPrice,
      isCrawlUpdating: true,
    };

    it('성공적으로 삭제한다.', () => {
      const priceId = faker.datatype.number();
      const item = new Item({
        prices: [
          new ItemPrice(),
          new ItemPrice({ ...addItemPriceInput, isBase: false, id: priceId }),
        ],
      });
      const result = item.removePrice(priceId);
      expect(result.id).toEqual(priceId);
      expect(item.prices.length).toEqual(1);
    });

    it('Base price를 삭제하면 BadRequestException 발생', () => {
      const priceId = faker.datatype.number();
      const item = new Item({
        prices: [
          new ItemPrice({ ...addItemPriceInput, id: priceId, isBase: true }),
        ],
      });
      expect(() => item.removePrice(priceId)).toThrow(BadRequestException);
    });

    it('활성화 상태인 Price를 삭제하면 Base price가 활성화된다.', () => {
      const priceLength = Math.max(3, faker.datatype.number(20));
      const priceId = faker.datatype.number();
      const baseIndex = 0;

      const item = new Item({
        prices: [
          new ItemPrice({ isBase: true, isActive: false }),
          ...[...Array(priceLength - 2)].map(() => new ItemPrice()),
          new ItemPrice({ isActive: true, id: priceId }),
        ],
      });
      item.removePrice(priceId);
      expect(item.prices.length).toEqual(priceLength - 1);
      expect(item.prices[baseIndex].isActive).toEqual(true);
    });
  });

  describe('activatePrice', () => {
    const priceId = faker.datatype.number();

    it('성공적으로 활성화한다.', () => {
      const item = new Item({
        prices: [
          new ItemPrice({ isActive: true }),
          new ItemPrice({ isActive: false, id: priceId }),
        ],
      });

      item.activatePrice(priceId);
      expect(item.prices[0].isActive).toEqual(false);
      expect(item.prices[1].isActive).toEqual(true);
    });

    it('존재하지 않는 priceId인 경우 NotFoundException 발생', () => {
      const item = new Item({
        prices: [
          new ItemPrice({ isActive: true }),
          new ItemPrice({ isActive: false }),
        ],
      });

      expect(() => item.activatePrice(priceId)).toThrow(NotFoundException);
    });

    it('이미 활성화된 경우 ConflictException 발생', () => {
      const item = new Item({
        prices: [
          new ItemPrice({ isActive: true, id: priceId }),
          new ItemPrice({ isActive: false }),
        ],
      });

      expect(() => item.activatePrice(priceId)).toThrow(ConflictException);
    });
  });

  describe('createOptionSet', () => {
    const createItemOptionSetInput: CreateItemOptionSetInput = {
      options: [],
    };
    const optionsCount = Math.max(1, faker.datatype.number(20));
    [...Array(optionsCount)].forEach(() => {
      createItemOptionSetInput.options.push({
        name: faker.lorem.text(),
        values: [
          {
            name: faker.lorem.text(),
            priceVariant: faker.datatype.number({ min: 0 }),
          },
          {
            name: faker.lorem.text(),
            priceVariant: faker.datatype.number({ min: 0 }),
          },
          {
            name: faker.lorem.text(),
            priceVariant: faker.datatype.number({ min: 0 }),
          },
        ],
      });
    });

    it('성공적으로 생성한다.', () => {
      const item = new Item();
      const { options } = createItemOptionSetInput;

      const result = item.createOptionSet(options);
      expect(options.length).toEqual(result.length);

      options.forEach((option, i) => {
        expect(result[i].name).toEqual(option.name);
        option.values.forEach((value, j) => {
          expect(result[i].values[j].name).toEqual(value.name);
          expect(result[i].values[j].priceVariant).toEqual(value.priceVariant);
        });
      });
    });

    it('옵션이 이미 존재하면 ConflictException 발생', () => {
      const item = new Item({ options: [new ItemOption()] });

      expect(() =>
        item.createOptionSet(createItemOptionSetInput.options)
      ).toThrow(ConflictException);
    });
  });
});
