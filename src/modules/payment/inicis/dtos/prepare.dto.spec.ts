import * as faker from 'faker';

import { CreatePaymentDtoCreator } from '@payment/payments/creators';

import { INICIS_MID } from '../constants';

import { InicisPrepareResponseDto } from './prepare.dto';

const HASH = 'HASH';
const SIGN = 'SIGN';

jest.mock('inicis', () => ({
  hash: () => HASH,
  sign: () => SIGN,
}));

describe('InicisPrepareResponseDto', () => {
  describe('of', () => {
    it('성공!', () => {
      const timestamp = faker.date.recent().getTime().toString();
      const { merchantUid, amount } = CreatePaymentDtoCreator.create();

      const result = InicisPrepareResponseDto.of(
        merchantUid,
        amount,
        timestamp
      );

      expect(result.timestamp).toBe(timestamp);
      expect(result.mid).toBe(INICIS_MID);
      expect(result.oid).toBe(merchantUid);
      expect(result.mKey).toBe(HASH);
      expect(result.signature).toBe(SIGN);
      expect(result.price).toBe(amount);
    });
  });
});
