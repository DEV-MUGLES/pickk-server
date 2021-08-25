import { ObjectType } from '@nestjs/graphql';

import { partialEncrypt } from '@common/helpers';

import { User } from '@user/users/models';

import { InquiryEntity } from '../entities';

const SECRET_TITLE = '비공개 문의입니다';

@ObjectType()
export class Inquiry extends InquiryEntity {
  securitify(userId: number): Inquiry {
    if (this.isSecret && userId === this.userId) {
      return this;
    }

    return new Inquiry({
      id: this.id,
      user: new User({
        id: 0,
        name: partialEncrypt(this.user.name),
      }),
      answers: [],
      type: this.type,
      title: SECRET_TITLE,
      isSecret: this.isSecret,
      isAnswered: this.isAnswered,
    });
  }
}
