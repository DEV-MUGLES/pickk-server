import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as faker from 'faker';

import { ItemNoticeType } from '../constants/item-notice.enum';
import {
  AddItemNoticeInput,
  UpdateItemNoticeInput,
} from '../dtos/item-notice.input';
import { AddItemPriceInput } from '../dtos/item-price.input';
import { AddItemUrlInput } from '../dtos/item-url.input';

import { ItemNotice } from './item-notice.model';
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

  const addItemNoticeInput: AddItemNoticeInput = {
    type: ItemNoticeType.General,
    message: faker.lorem.text(),
    startAt: faker.datatype.datetime(),
    endAt: faker.datatype.datetime(),
  };

  describe('addNotice', () => {
    it('성공적으로 추가된다.', () => {
      const item = new Item();
      expect(item.addNotice(addItemNoticeInput)).toMatchObject(
        addItemNoticeInput
      );
    });

    it('이미 존재할 경우 ConflictException 발생', () => {
      const item = new Item({
        notice: new ItemNotice(),
      });
      try {
        item.addNotice(addItemNoticeInput);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  const updateItemNoticeInput: UpdateItemNoticeInput = {
    message: faker.lorem.text(),
    endAt: faker.datatype.datetime(),
  };

  describe('updateNotice', () => {
    it('성공적으로 업데이트된다.', () => {
      const item = new Item({
        notice: new ItemNotice(addItemNoticeInput),
      });
      expect(item.updateNotice(updateItemNoticeInput)).toMatchObject(
        updateItemNoticeInput
      );
    });

    it('Notice가 존재하지 않으면 NotFoundException 발생', () => {
      const item = new Item();
      try {
        item.updateNotice(updateItemNoticeInput);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('removeNotice', () => {
    it('삭제 후 해당 Notice를 반환한다.', () => {
      const item = new Item({
        notice: new ItemNotice(addItemNoticeInput),
      });
      expect(item.removeNotice()).toMatchObject(addItemNoticeInput);
      expect(item.notice).toEqual(null);
    });

    it('Notice가 존재하지 않으면 NotFoundException 발생', () => {
      const item = new Item();
      try {
        item.removeNotice();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
