import { Test, TestingModule } from '@nestjs/testing';
import { SqsModule } from '@pickk/nestjs-sqs';
import * as faker from 'faker';

import { AwsSqsProviderModule } from '@providers/aws/sqs';
import { ProcessSellerItemsScrapResultMto } from '@queue/mtos';
import { SellerProducer } from './seller.producer';
import { MAX_SQS_MESSAGE_SIZE } from '@queue/constants';

describe('SellerProducer', () => {
  let sellerProducer: SellerProducer;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsSqsProviderModule, SqsModule.registerQueue()],
      providers: [SellerProducer],
    }).compile();
    sellerProducer = module.get<SellerProducer>(SellerProducer);
  });
  describe('splitProcessSellerItemsScrapResultMto', () => {
    it('성공적으로 MAX_SQS_MESSAGE_SIZE보다 작은 사이즈의 mto들로 분할되어 반환되어야 합니다', () => {
      const mockScrapResultMto: ProcessSellerItemsScrapResultMto = {
        brandId: faker.datatype.number({ min: 1 }),
        items: Array.from(new Array(10000)).map(() => ({
          name: faker.commerce.productName(),
          brandKor: faker.company.companyName(),
          imageUrl: faker.image.abstract(),
          images: [
            faker.image.animals(),
            faker.image.animals(),
            faker.image.animals(),
          ],
          originalPrice: faker.datatype.number({ min: 1000, max: 10000 }),
          salePrice: faker.datatype.number({ min: 100, max: 1000 }),
          url: faker.internet.url(),
          isSoldout: faker.datatype.boolean(),
          code: faker.datatype.string(10),
        })),
        pickkDiscountRate: 5,
      };

      const splitedMtos =
        sellerProducer.splitProcessSellerItemsScrapResultMto(
          mockScrapResultMto
        );
      const splitedMtoItems = [];
      splitedMtos.forEach((r) => splitedMtoItems.push(...r.items));

      splitedMtos.forEach((splitedMto) => {
        expect(JSON.stringify(splitedMto).length).toBeLessThan(
          MAX_SQS_MESSAGE_SIZE
        );
      });
      expect(splitedMtoItems).toMatchObject(mockScrapResultMto.items);
    });
  });
});
