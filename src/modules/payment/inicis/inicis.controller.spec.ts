import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { SlackService } from '@providers/slack';

import { CreatePaymentDtoCreator } from '@payment/payments/creators';
import { Payment } from '@payment/payments/models';
import { PaymentsRepository } from '@payment/payments/payments.repository';
import { PaymentsService } from '@payment/payments/payments.service';

import { StdVbankNotiDtoCreator } from './creators';
import { InicisPrepareResponseDto } from './dtos';
import { AbnormalVbankNotiException } from './exceptions';
import { InicisProducer } from './producers';

import { InicisController } from './inicis.controller';
import { InicisService } from './inicis.service';

describe('InicisController', () => {
  let inicisController: InicisController;
  let inicisService: InicisService;
  let paymentsService: PaymentsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InicisController],
      providers: [
        InicisService,
        PaymentsService,
        SlackService,
        PaymentsRepository,
        {
          provide: SlackService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        {
          provide: InicisProducer,
          useValue: {
            processVbankPaidOrder: jest.fn(),
            sendVbankPaidAlimtalk: jest.fn(),
          },
        },
      ],
    }).compile();

    inicisController = app.get<InicisController>(InicisController);
    inicisService = app.get<InicisService>(InicisService);
    paymentsService = app.get<PaymentsService>(PaymentsService);
  });

  describe('acceptStdVbankNoti', () => {
    it('성공!"', async () => {
      const dto = StdVbankNotiDtoCreator.create(true);
      const payment = new Payment();

      const paymentsServiceFindOneSpy = jest
        .spyOn(paymentsService, 'findOne')
        .mockResolvedValueOnce(payment);
      const inicisValidateSpy = jest
        .spyOn(inicisService, 'validateStdVbankNoti')
        .mockImplementationOnce(async () => true);
      const paymentsServiceConfirmSpy = jest
        .spyOn(paymentsService, 'confirmVbankPaid')
        .mockResolvedValueOnce(null);

      const result = await inicisController.acceptStdVbankNoti(dto);
      expect(result).toEqual('OK');
      expect(paymentsServiceFindOneSpy).toHaveBeenCalledWith({
        merchantUid: dto.no_oid,
      });
      expect(inicisValidateSpy).toHaveBeenCalled();
      expect(paymentsServiceConfirmSpy).toHaveBeenCalledWith(payment);
    });

    it('정상 입금건이 아닌 경우 실패한다."', () => {
      const stdVbankNotiDto = StdVbankNotiDtoCreator.create(false);

      expect(
        inicisController.acceptStdVbankNoti(stdVbankNotiDto)
      ).rejects.toThrow(AbnormalVbankNotiException);
    });
  });

  describe('prepare', () => {
    it('성공!', async () => {
      const now = faker.date.recent().getTime();
      const timestamp = new Date(now).getTime().toString();

      const dateNowSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(now);

      const dto = CreatePaymentDtoCreator.create();

      const paymentsServiceCreateOrUpdateSpy = jest
        .spyOn(paymentsService, 'createOrUpdate')
        .mockImplementationOnce(async () => null);
      const resDtoOfSpy = jest
        .spyOn(InicisPrepareResponseDto, 'of')
        .mockImplementationOnce(() => null);

      await inicisController.prepare(dto);
      expect(paymentsServiceCreateOrUpdateSpy).toHaveBeenCalledWith(dto);
      expect(dateNowSpy).toHaveBeenCalledTimes(1);
      expect(resDtoOfSpy).toHaveBeenCalledWith(
        dto.merchantUid,
        dto.amount,
        timestamp
      );
    });
  });
});
