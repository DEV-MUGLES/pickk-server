import * as faker from 'faker';
import dayjs from 'dayjs';

import { BankCode } from '@common/constants';
import { getRandomEle, getRandomEnumValue } from '@common/helpers';

import { InicisStdVbankNotiDto } from '../dtos';

export class StdVbankNotiDtoCreator {
  /** success 여부 또는 Attributes를 직접 받아 dto를 생성합니다. */
  static create(
    successOrAttributes: boolean | Partial<InicisStdVbankNotiDto>
  ): InicisStdVbankNotiDto {
    if (typeof successOrAttributes === 'boolean') {
      return new InicisStdVbankNotiDto({
        ...this.getMockAttributes(),
        type_msg: successOrAttributes ? '0200' : '0000',
      });
    } else {
      return new InicisStdVbankNotiDto({
        ...this.getMockAttributes(),
        ...successOrAttributes,
      });
    }
  }

  private static getMockAttributes(): InicisStdVbankNotiDto {
    return {
      no_oid: faker.datatype.uuid(),
      no_tid: faker.datatype.uuid(),
      dt_calculstd: dayjs(faker.date.recent()).format('YYYYMMDD'),
      dt_inputstd: dayjs(faker.date.recent()).format('YYYYMMDD'),
      dt_transbase: dayjs(faker.date.recent()).format('YYYYMMDD'),
      dt_trans: dayjs(faker.date.recent()).format('YYYYMMDD'),
      tm_Trans: dayjs(faker.date.recent()).format('HHmmss'),
      cd_bank: getRandomEnumValue(BankCode) as BankCode,
      cd_deal: getRandomEnumValue(BankCode) as BankCode,
      no_vacct: faker.phone.phoneNumber('######-##-######'),
      amt_input: faker.datatype.number({ min: 1000, max: 1000000 }),
      flg_close: getRandomEle(['0', '1']),
      cl_close: getRandomEle(['0', '1']),
      type_msg: faker.datatype.boolean() ? '0200' : '0000',
      nm_inputbank: '수민은행',
      nm_input: faker.name.findName(),
      cl_trans: '1100',
      cl_kor: '',
    };
  }
}
