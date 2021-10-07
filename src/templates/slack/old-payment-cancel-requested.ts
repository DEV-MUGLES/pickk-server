import { IncomingWebhookSendArguments } from '@slack/webhook';

import { getBankDisplayName } from '@common/helpers';
import { SlackChannelName } from '@providers/slack/constants';

import { CancelPaymentInput } from '@payment/payments/dtos';

import { BaseSlackTemplate } from './base-slack.template';

// @TODO: 필요 없어지면(오래 지나서 더 이상 발생 안하면) 지우기!
export class OldPaymentCancelRequestedTemplate extends BaseSlackTemplate {
  static create(
    merchantUid: string,
    input: CancelPaymentInput
  ): IncomingWebhookSendArguments {
    const {
      amount,
      reason,
      refundVbankCode,
      refundVbankHolder,
      refundVbankNum,
    } = input;
    const iamportConsoleUrl = 'https://admin.iamport.kr/';

    return {
      channel: SlackChannelName.Emergency,
      blocks: this.getBlocksBuilder()
        .addText(`🚨 *(구)주문 취소/반품으로 인한 결제건 취소 발생*`)
        .addText(
          `요청유저에게는 정상적으로 취소 완료되었다고 안내된 상황입니다. 빠르게 대응해주세요!`
        )
        .addText(`*(현) merchantUid*:\n${merchantUid}`)
        .addText(`*(구) merchantUid*:\n${merchantUid.slice(0, 12)}`)
        .addText(`*취소 요청 금액*:\n${amount}`)
        .addText(`*사유*:\n${reason}`)
        .addText(
          `*(가상계좌인 경우) 환불 계좌 은행*:\n${getBankDisplayName(
            refundVbankCode
          )}`
        )
        .addText(
          `*(가상계좌인 경우) 환불 계좌 예금주*:\n${refundVbankHolder ?? ''}`
        )
        .addText(`*(가상계좌인 경우) 환불 계좌 번호*:\n${refundVbankNum ?? ''}`)
        .addButtons([
          {
            text: '아임포트 관리자 페이지로',
            url: iamportConsoleUrl,
            style: 'primary',
          },
        ])
        .build(),
    };
  }
}
