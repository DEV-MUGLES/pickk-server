import { User } from '@user/users/models';

export const enrichIsMe = (userId: number, target: User) => {
  if (!userId) {
    return;
  }

  target.isMe = target.id === userId;
};

export const enrichUserIsMe = <
  T extends { user?: { id: number; isMe: boolean } }
>(
  userId: number,
  owner: T
) => {
  if (!userId || !owner.user) {
    return;
  }

  owner.user.isMe = owner.user.id === userId;
};

export const enrichIsMine = <Owner extends { userId: number; isMine: boolean }>(
  userId: number,
  owner: Owner
) => {
  if (!userId) {
    return;
  }

  owner.isMine = owner.userId === userId;
};

export const bulkEnrichIsMine = <T extends { userId: number; isMine: boolean }>(
  userId: number,
  owners: T[]
) => {
  if (!userId) {
    return;
  }

  for (const owner of owners) {
    owner.isMine = owner.userId === userId;
  }
};

export const bulkEnrichUserIsMe = <
  T extends { user?: { id: number; isMe: boolean } }
>(
  userId: number,
  owners: T[]
) => {
  if (!userId) {
    return;
  }

  for (const owner of owners) {
    if (!owner.user) {
      return;
    }
    owner.user.isMe = owner.user.id === userId;
  }
};
