import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as faker from 'faker';

import { ItemNoticeType } from '../constants';
import {
  AddItemNoticeInput,
  UpdateItemNoticeInput,
  CreateItemOptionSetInput,
  AddItemPriceInput,
  AddItemSizeChartInput,
  UpdateItemSizeChartInput,
  AddItemUrlInput,
} from '../dtos';

import { ItemNotice } from './item-notice.model';
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

      expect(() => item.addNotice(addItemNoticeInput)).toThrow(
        ConflictException
      );
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

      expect(() => item.updateNotice(updateItemNoticeInput)).toThrow(
        NotFoundException
      );
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
      expect(() => item.removeNotice()).toThrow(NotFoundException);
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
          expect(result[i].values[j].name).toEqual(value);
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

  const inputCount = Math.max(1, faker.datatype.number(10));
  const getItemSizeChartMock = () => ({
    name: faker.name.firstName(),
    accDepth: faker.datatype.float(200),
    accHeight: faker.datatype.float(200),
    accWidth: faker.datatype.float(200),
    chestWidth: faker.datatype.float(200),
    crossStrapLength: faker.datatype.float(200),
    glassBridgeLength: faker.datatype.float(200),
    glassLegLength: faker.datatype.float(200),
    glassWidth: faker.datatype.float(200),
    hemWidth: faker.datatype.float(200),
    riseHeight: faker.datatype.float(200),
    shoulderWidth: faker.datatype.float(200),
    sleeveLength: faker.datatype.float(200),
    thighWidth: faker.datatype.float(200),
    totalLength: faker.datatype.float(200),
    waistWidth: faker.datatype.float(200),
    watchBandDepth: faker.datatype.float(200),
  });

  const addItemSizeChartInputs: AddItemSizeChartInput[] = [
    ...Array(inputCount),
  ].map(() => getItemSizeChartMock());

  describe('addSizeCharts', () => {
    it('아이템에 사이즈 차트가 성공적으로 추가된다.', async () => {
      const item = new Item();

      const itemSizeCharts = item.addSizeCharts(addItemSizeChartInputs);
      expect(itemSizeCharts.length).toEqual(addItemSizeChartInputs.length);
      itemSizeCharts.forEach((sizeChart, i) => {
        expect(sizeChart).toMatchObject(addItemSizeChartInputs[i]);
      });
    });
  });

  const updateItemSizeChartInputs: Array<UpdateItemSizeChartInput> = [
    ...Array(inputCount),
  ].map((_, index) => ({ id: index + 1, ...getItemSizeChartMock() }));

  describe('updateSizeCharts', () => {
    it('성공적으로 업데이트한다.', async () => {
      const item = new Item({
        sizeCharts: addItemSizeChartInputs.map(
          (input, index) => new ItemSizeChart({ id: index + 1, ...input })
        ),
      });

      const itemSizeCharts = item.updateSizeCharts(updateItemSizeChartInputs);
      expect(itemSizeCharts.length).toEqual(updateItemSizeChartInputs.length);
      itemSizeCharts.forEach((sizeChart, i) => {
        expect(sizeChart).toMatchObject(updateItemSizeChartInputs[i]);
      });
    });

    it('sizeChart가 존재하지 않으면 NotFoundException 발생', async () => {
      const item = new Item({
        sizeCharts: [new ItemSizeChart(addItemSizeChartInputs[0])],
      });

      expect(() => item.updateSizeCharts(updateItemSizeChartInputs)).toThrow(
        NotFoundException
      );
    });
  });

  describe('removeSizeChartsAll', () => {
    it('성공적으로 사이즈 차트가 모두 삭제된다.', async () => {
      const item = new Item({
        sizeCharts: addItemSizeChartInputs.map(
          (input) => new ItemSizeChart(input)
        ),
      });

      expect(item.removeSizeChartsAll()).toMatchObject(addItemSizeChartInputs);
      expect(item.sizeCharts).toEqual([]);
    });

    it('sizeCharts가 존재하지 않으면 NotFoundException 발생', async () => {
      const item = new Item();

      expect(item.removeSizeChartsAll).toThrow(NotFoundException);
    });
  });

  describe('removeSizeChartsByIds', () => {
    it('성공적으로 삭제된다', async () => {
      const item = new Item({
        sizeCharts: [...Array(inputCount)].map(
          (_, index) => new ItemSizeChart(addItemSizeChartInputs[index])
        ),
      });
      const sizeChartIds: number[] = [];
      [...Array(inputCount)].forEach((_, index) => {
        item.sizeCharts[index].id = index + 1;
        sizeChartIds.push(index + 1);
      });

      const itemSizeCharts = item.removeSizeChartsByIds(sizeChartIds);
      expect(itemSizeCharts).toHaveLength(0);
    });
  });
});
