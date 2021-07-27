import { hash, sign } from 'inicis';

import { INICIS_MID, INICIS_SIGNKEY } from '@payment/inicis/constants';

export class InicisPrepareResponseDto {
  timestamp: string;
  mid: string;
  oid: string;
  mKey: string;
  signature: string;
  price: number;

  version = '1.0';
  gopaymethod = '';
  currency = 'WON';

  static of(
    merchantUid: string,
    amount: number,
    timestamp: string
  ): InicisPrepareResponseDto {
    const result = new InicisPrepareResponseDto();

    const mKey = hash(INICIS_SIGNKEY, 'sha256');
    const signature = sign({
      oid: merchantUid,
      price: amount,
      timestamp,
    });

    result.timestamp = timestamp;
    result.mid = INICIS_MID;
    result.oid = merchantUid;
    result.mKey = mKey;
    result.signature = signature;
    result.price = amount;

    return result;
  }
}
