import { AlimtalkMessageRequest } from '@nestjs-packages/ncp-sens';

import { ISellerInfo } from './intefaces';

export class DelayedRefundRequestsTemplate {
  static code = 'bdyrefund';

  static toRequest(
    sellerInfo: ISellerInfo,
    delayedCount: number
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const { phoneNumber, brandKor } = sellerInfo;
    return {
      templateCode: this.code,
      messages: [
        {
          to: phoneNumber,
          content: this.toContent(brandKor, delayedCount),
        },
      ],
    };
  }
  static toContent(brandKor: string, delayedCount: number): string {
    return `안녕하세요! ${brandKor} 담당자님, 처리가 지연되고 있는 반품요청이 ${delayedCount}건 있습니다.

핔 스토어어드민 반품 관리 메뉴에서 '반품처리 지연' 필터를 통해 확인하실 수 있습니다.
반품상품 입고여부 확인 후 빠른 처리 부탁드립니다.
    `;
  }
}
