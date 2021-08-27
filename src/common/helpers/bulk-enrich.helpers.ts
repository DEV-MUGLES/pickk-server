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
