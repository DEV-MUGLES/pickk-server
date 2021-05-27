import { registerEnumType } from '@nestjs/graphql';
import { InicisBankCode } from 'inicis';

registerEnumType(InicisBankCode, {
  name: 'InicisBankCode',
  description:
    '은행 코드입니다. KG Inicis와 관련 없는 일반 계좌를 저장할 때도 사용됩니다.',
});
