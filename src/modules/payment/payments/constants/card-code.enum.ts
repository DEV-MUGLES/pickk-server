import { registerEnumType } from '@nestjs/graphql';

export enum CardCode {
  /** 외환카드 */
  Keb = '01',
  /** 롯데카드 */
  Lotte = '03',
  /** 현대카드 */
  Hyundai = '04',
  /** 국민카드 */
  Kb = '06',
  /** 비씨카드 */
  Bc = '11',
  /** 삼성카드 */
  Samsung = '12',
  /** 신한카드 */
  Shinhan = '14',
  /** 한미카드 */
  Hanmi = '15',
  /** NH농협카드 */
  Nh = '16',
  /** 하나SK카드 */
  Hanask = '17',
  /** 해외비자 */
  Visa = '21',
  /** 해외마스터 */
  Master = '22',
  /** 해외JCB */
  Jcb = '23',
  /** 해외아멕스 */
  Amex = '24',
  /** 해외다이너스 */
  Diners = '25',
  /** 네이버포인트 (포인트 100% 사용) */
  NaverPoint = '91',
  /** 토스머니 (포인트 100% 사용) */
  TossMoney = '93',
  /** SSG머니 (포인트 100% 사용) */
  SsgMoney = '94',
  /** 엘포인트 (포인트 100% 사용) */
  LPoint = '96',
  /** 카카오머니 */
  KakaoMoney = '97',
  /** 페이조 (포인트 100% 사용) */
  Payco = '98',
}

registerEnumType(CardCode, {
  name: 'CardCode',
});
