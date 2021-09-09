import { BankCode } from '@common/constants';

export const getBankCodeDisplayName = (code: BankCode): string => {
  const {
    Ibk,
    Kb,
    Shinhan,
    Woori,
    KakaoBank,
    Hana,
    Keb,
    Citi,
    Hanmi,
    Kdb,
    Sc,
    EPost,
    NhBank,
    ShBank,
    Nonghyup,
    ChBank,
    Commercial,
    Hanil,
    Seoul,
    Daegu,
    Busan,
    Kwangju,
    Jeju,
    Jeonbuk,
    Kangwon,
    Kyongnam,
    Cu,
    MutualSavings,
    Sj,
    Shinan,
    Peace,
    Shinsegae,
    KBank,
  } = BankCode;

  return {
    [Ibk]: '기업은행',
    [Kb]: '국민은행',
    [Shinhan]: '신한은행',
    [Woori]: '우리은행',
    [KakaoBank]: '카카오뱅크',
    [Hana]: '하나은행',
    [Keb]: '하나은행 (구. 외환)',
    [Citi]: '한국씨티은행',
    [Hanmi]: '한국씨티은행 (구. 한미)',
    [Kdb]: '한국산업은행',
    [Sc]: 'SC제일은행',
    [EPost]: '우체국',
    [NhBank]: '농협',
    [ShBank]: '수협',
    [Nonghyup]: '단위농협',
    [ChBank]: '축협',
    [Commercial]: '상업은행',
    [Hanil]: '한일은행',
    [Seoul]: '서울은행',
    [Daegu]: '대구은행',
    [Busan]: '부산은행',
    [Kwangju]: '광주은행',
    [Jeju]: '제주은행',
    [Jeonbuk]: '전북은행',
    [Kangwon]: '강원은행',
    [Kyongnam]: '경남은행',
    [Cu]: '신용협동조합중앙회',
    [MutualSavings]: '상호저축은행',
    [Sj]: '산림조합',
    [Shinan]: '신안상호저축은행',
    [Peace]: '평화은행',
    [Shinsegae]: '신세계',
    [KBank]: '케이뱅크',
  }[code];
};
