import { Entity } from 'typeorm';

import { AbstractImageEntity } from '@common/entities';

@Entity({
  name: 'user_avatar_image',
})
export class UserAvatarImageEntity extends AbstractImageEntity {}
