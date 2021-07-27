import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { InicisService } from '@payment/inicis/inicis.service';

import { PaymentStatus } from './constants';
import { CreatePaymentDtoCreator } from './creators';
import { Payment } from './models';

import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: PaymentsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        PaymentsService,
        PaymentsRepository,
        InicisService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentsController = app.get<PaymentsController>(PaymentsController);
    paymentsService = app.get<PaymentsService>(PaymentsService);
  });

  describe('createOrUpdate', () => {
    it('해당 entity가 존재하지 않으면 새로 생성한다.', async () => {
      const dto = CreatePaymentDtoCreator.create();

      const paymentsServiceGetSpy = jest
        .spyOn(paymentsService, 'get')
        .mockImplementationOnce(async () => {
          throw new NotFoundException();
        });
      const paymentsServiceUpdateSpy = jest.spyOn(paymentsService, 'update');
      const paymentsServiceCreateSpy = jest
        .spyOn(paymentsService, 'create')
        .mockResolvedValueOnce(
          new Payment({ ...dto, status: PaymentStatus.Pending })
        );

      const result = await paymentsController.createOrUpdate(dto);
      expect(result).toMatchObject(dto);
      expect(paymentsServiceGetSpy).toHaveBeenCalledWith(dto.merchantUid);
      expect(paymentsServiceUpdateSpy).toHaveBeenCalledTimes(0);
      expect(paymentsServiceCreateSpy).toHaveBeenCalledWith(dto);
    });

    it('해당 entity가 존재하면 업데이트한다.', async () => {
      const dto = CreatePaymentDtoCreator.create();
      const payment = new Payment({ ...CreatePaymentDtoCreator.create() });

      const paymentsServiceGetSpy = jest
        .spyOn(paymentsService, 'get')
        .mockImplementationOnce(async () => payment);
      const paymentsServiceUpdateSpy = jest
        .spyOn(paymentsService, 'update')
        .mockResolvedValueOnce(new Payment({ ...payment, ...dto }));
      const paymentsServiceCreateSpy = jest.spyOn(paymentsService, 'create');

      const result = await paymentsController.createOrUpdate(dto);
      expect(result).toMatchObject(dto);
      expect(paymentsServiceGetSpy).toHaveBeenCalledWith(dto.merchantUid);
      expect(paymentsServiceUpdateSpy).toHaveBeenCalledWith(payment, {
        ...dto,
        status: PaymentStatus.Pending,
      });
      expect(paymentsServiceCreateSpy).toHaveBeenCalledTimes(0);
    });
  });
});
