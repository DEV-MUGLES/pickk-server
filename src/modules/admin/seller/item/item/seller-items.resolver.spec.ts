import { Test } from '@nestjs/testing';
import faker from 'faker';

import { ItemSearchService } from '@mcommon/search/item.search.service';
import { ProductsRepository } from '@item/products/products.repository';
import { ProductsService } from '@item/products/products.service';
import { CrawlerProviderModule } from '@providers/crawler';

import { Item } from '@item/items/models';
import { ItemsService } from '@item/items/items.service';

import { SellerItemResolver } from './seller-item.resolver';

describe('SellerItemResolver', () => {
  let itemsService: ItemsService;
  let sellerItemsResolver: SellerItemResolver;
  const itemId = 1;
  const item = new Item({ id: itemId });

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
      imports: [CrawlerProviderModule],
      providers: [
        SellerItemResolver,
        ItemsService,
        ProductsService,
        ProductsRepository,
        {
          provide: ProductsService,
          useValue: new ProductsService(null, null),
        },
        {
          provide: ItemSearchService,
          useValue: new ItemSearchService(null, null),
        },
        {
          provide: ItemsService,
          useValue: new ItemsService(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
          ),
        },
      ],
    }).compile();

    itemsService = moduleRef.get<ItemsService>(ItemsService);
    sellerItemsResolver = moduleRef.get<SellerItemResolver>(SellerItemResolver);

    jest.spyOn(itemsService, 'get').mockResolvedValue(item);
    jest.spyOn(itemsService, 'updateSizeCharts').mockResolvedValue(item);
  });

  const addSizeChartInputs = [...Array(5)].map(getItemSizeChartMock);
  const updateSizeChartInputs = [...Array(5)].map((_, index) =>
    getItemSizeChartMock(index + 1)
  );
  const removedChartIds = [...Array(5)].map((_, index) => index + 1);
  describe('modifyItemSizeCharts', () => {
    it('성공적으로 사이즈 차트가 추가된다.', async () => {
      jest.spyOn(itemsService, 'addSizeCharts').mockResolvedValue(item);

      await sellerItemsResolver.modifyItemSizeCharts(
        itemId,
        addSizeChartInputs,
        []
      );

      expect(itemsService.addSizeCharts).toHaveBeenCalledWith(
        item,
        addSizeChartInputs
      );
    });

    it('성공적으로 사이즈 차트를 업데이트한다.', async () => {
      await sellerItemsResolver.modifyItemSizeCharts(
        itemId,
        updateSizeChartInputs,
        []
      );

      expect(itemsService.updateSizeCharts).toHaveBeenCalledWith(
        item,
        updateSizeChartInputs
      );
    });

    it('성공적으로 사이즈 차트를 삭제한다.', async () => {
      jest.spyOn(itemsService, 'removeSizeChartsByIds').mockResolvedValue(item);

      await sellerItemsResolver.modifyItemSizeCharts(
        itemId,
        [],
        removedChartIds
      );
      expect(itemsService.removeSizeChartsByIds).toHaveBeenCalledWith(
        item,
        removedChartIds
      );
    });

    it('성공적으로 사이즈 차트에 추가, 삭제, 업데이트한다', async () => {
      jest.spyOn(itemsService, 'addSizeCharts').mockResolvedValue(item);
      jest.spyOn(itemsService, 'removeSizeChartsByIds').mockResolvedValue(item);

      await sellerItemsResolver.modifyItemSizeCharts(
        itemId,
        [...addSizeChartInputs, ...updateSizeChartInputs],
        removedChartIds
      );
      expect(itemsService.removeSizeChartsByIds).toHaveBeenCalledWith(
        item,
        removedChartIds
      );
      expect(itemsService.addSizeCharts).toHaveBeenCalledWith(
        item,
        addSizeChartInputs
      );
      expect(itemsService.updateSizeCharts).toHaveBeenCalledWith(
        item,
        updateSizeChartInputs
      );
    });
  });
});
