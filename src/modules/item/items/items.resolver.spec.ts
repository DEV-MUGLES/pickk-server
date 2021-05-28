import { Test } from '@nestjs/testing';
import faker from 'faker';
import { ProductsRepository } from '../products/products.repository';
import { ProductsService } from '../products/products.service';
import {
  ItemDetailImagesRepository,
  ItemOptionsRepository,
  ItemOptionValuesRepository,
  ItemPricesRepository,
  ItemSizeChartsRepository,
  ItemsRepository,
} from './items.repository';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';
import { Item } from './models/item.model';

describe('itemsResolver', () => {
  let itemsService: ItemsService;
  let productsService: ProductsService;
  let itemsResolver: ItemsResolver;

  const getItemSizeChartMock = (id?: number) => ({
    id: id ?? null,
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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ItemsService,
        ProductsService,
        ItemsRepository,
        ItemOptionsRepository,
        ItemOptionValuesRepository,
        ItemSizeChartsRepository,
        ItemPricesRepository,
        ItemDetailImagesRepository,
        ProductsRepository,
      ],
    }).compile();

    itemsService = moduleRef.get<ItemsService>(ItemsService);
    productsService = moduleRef.get<ProductsService>(ProductsService);
    itemsResolver = new ItemsResolver(itemsService, productsService);
    jest.spyOn(itemsService, 'get').mockResolvedValue(new Item());
    jest.spyOn(itemsService, 'updateSizeCharts').mockResolvedValue(new Item());
  });

  const addSizeChartInputs = [...Array(5)].map(getItemSizeChartMock);
  const updateSizeChartInputs = [...Array(5)].map((_, index) =>
    getItemSizeChartMock(index + 1)
  );
  const removedChartIds = [...Array(5)].map((_, index) => index + 1);
  describe('modifyItemSizeCharts', () => {
    it('성공적으로 사이즈 차트가 추가된다.', async () => {
      jest.spyOn(itemsService, 'addSizeCharts').mockResolvedValue(new Item());

      await itemsResolver.modifyItemSizeCharts(1, addSizeChartInputs, []);

      expect(itemsService.addSizeCharts).toBeCalledTimes(1);
    });

    it('성공적으로 사이즈 차트를 업데이트한다.', async () => {
      await itemsResolver.modifyItemSizeCharts(1, updateSizeChartInputs, []);

      expect(itemsService.updateSizeCharts).toBeCalledTimes(1);
    });

    it('성공적으로 사이즈 차트를 삭제한다.', async () => {
      jest
        .spyOn(itemsService, 'removeSizeChartsByIds')
        .mockResolvedValue(new Item());

      await itemsResolver.modifyItemSizeCharts(1, [], removedChartIds);
      expect(itemsService.removeSizeChartsByIds).toBeCalledTimes(1);
    });

    it('성공적으로 사이즈 차트에 추가, 삭제, 업데이트한다', async () => {
      jest.spyOn(itemsService, 'addSizeCharts').mockResolvedValue(new Item());
      jest
        .spyOn(itemsService, 'removeSizeChartsByIds')
        .mockResolvedValue(new Item());

      await itemsResolver.modifyItemSizeCharts(
        1,
        [...addSizeChartInputs, ...updateSizeChartInputs],
        removedChartIds
      );
      expect(itemsService.removeSizeChartsByIds).toBeCalledTimes(1);
      expect(itemsService.addSizeCharts).toBeCalledTimes(1);
      expect(itemsService.updateSizeCharts).toBeCalledTimes(1);
    });
  });
});
