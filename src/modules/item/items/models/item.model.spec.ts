import { BadRequestException } from '@nestjs/common';
import * as faker from 'faker';

import { AddItemPriceInput } from '../dtos/item-price.input';
import { AddItemUrlInput } from '../dtos/item-url.input';
import { ItemPrice } from './item-price.model';

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
    const [pickkDiscountAmount, sellPrice, originalPrice] = [
      faker.datatype.number(),
      faker.datatype.number(),
      faker.datatype.number(),
    ].sort();
    const finalPrice = sellPrice - pickkDiscountAmount;

    const addItemPriceInput: AddItemPriceInput = {
      originalPrice,
      sellPrice,
      pickkDiscountAmount,
      finalPrice,
      isBase: true,
      isActive: true,
      isCrawlUpdating: true,
    };

    it('추가된 Price를 반환한다.', () => {
      const item = new Item();
      const result = item.addPrice(addItemPriceInput);
      expect(result).toMatchObject(addItemPriceInput);
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
    const [pickkDiscountAmount, sellPrice, originalPrice] = [
      faker.datatype.number(),
      faker.datatype.number(),
      faker.datatype.number(),
    ].sort();
    const finalPrice = sellPrice - pickkDiscountAmount;

    const addItemPriceInput: AddItemPriceInput = {
      originalPrice,
      sellPrice,
      pickkDiscountAmount,
      finalPrice,
      isActive: true,
      isCrawlUpdating: true,
      isBase: true,
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

    it('Base price는 삭제할 수 없다.', () => {
      const priceId = faker.datatype.number();
      const item = new Item({
        prices: [new ItemPrice({ ...addItemPriceInput, id: priceId })],
      });
      try {
        item.removePrice(priceId);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
