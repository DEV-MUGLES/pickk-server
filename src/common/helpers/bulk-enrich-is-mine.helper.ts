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
