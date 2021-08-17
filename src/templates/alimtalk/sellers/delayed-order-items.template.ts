import { AlimtalkMessageRequest } from 'nest-sens';

export class DelayedOrderItemsTemplate {
  static code = 'bdyoi';

  static toRequest(
    seller: { brandKor: string; phoneNumber: string },
    delayedCount: number
  ): Omit<AlimtalkMessageRequest, 'plusFriendId'> {
    const { phoneNumber, brandKor } = seller;
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
    return `안녕하세요! ${brandKor} 담당자님, 발송처리가 지연되고 있는 주문이 ${delayedCount}건 있습니다.

핔 스토어어드민 발주/발송 관리 메뉴에서 '신규주문 지연', '발송준비 지연' 필터를 통해 확인하실 수 있습니다.
바로 발송이 어려우실 경우, 지연발송 기능을 통해 고객님께 안내부탁드립니다.
    `;
  }
}
