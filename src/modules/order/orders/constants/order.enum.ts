import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Pending = 'pending',
  Paying = 'paying',
  Failed = 'failed',
  VbankReady = 'vbank_ready',
  Paid = 'paid',
  /** 발주 전 즉시 취소된 경우만 Withdrawn으로 변경됨 */
  Withdrawn = 'withdrawn',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: '주문 상태입니다. 클라이언트에선 거의 사용되지 않을 값입니다.',
});

export enum PayMethod {
  /** 신용카드 */
  Card = 'card',
  /** 실시간계좌이체 */
  Trans = 'trans',
  /** 가상계좌 */
  Vbank = 'vbank',
  /** 휴대폰소액결제 */
  Phone = 'phone',
  /** 삼성페이 (이니시스, KCP 전용) */
  Samsungpay = 'samsungpay',
  /** KPay앱 직접호출 (이니시스 전용) */
  Kpay = 'kpay',
  /** 카카오페이 직접호출 (이니시스, KCP, 나이스페이먼츠 전용) */
  Kakaopay = 'kakaopay',
  /** 페이코 직접호출 (이니시스, KCP 전용) */
  Payco = 'payco',
  /** LPAY 직접호출 (이니시스 전용) */
  Lpay = 'lpay',
  /** SSG페이 직접호출 (이니시스 전용) */
  Ssgpay = 'ssgpay',
  /** 토스간편결제 직접호출 (이니시스 전용) */
  Tosspay = 'tosspay',
  /** 문화상품권 (이니시스, LGU+, KCP 전용) */
  Cultureland = 'cultureland',
  /** 스마트문상 (이니시스, LGU+, KCP 전용) */
  Smartculture = 'smartculture',
  /** 해피머니 (이니시스, KCP 전용) */
  Happymoney = 'happymoney',
  /** 도서문화상품권 (LGU+, KCP 전용) */
  Booknlife = 'booknlife',
  /** 베네피아 포인트 등 포인트 결제 (KCP 전용) */
  Point = 'point',
  /** 네이버페이 직접호출 (이니시스 전용) */
  Naverpay = 'naverpay',
  /** 차이페이 직접호출 (이니시스 전용) */
  Chaipay = 'chaipay',
}

registerEnumType(PayMethod, {
  name: 'PayMethod',
  description: '결제수단입니다.',
});
