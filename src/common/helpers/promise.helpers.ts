export const isIterator = (obj) => {
  return !!obj && !!obj[Symbol.iterator];
};

export type FulfillResponse<T = unknown> = {
  status: 'fulfilled';
  value: T;
};

export type RejectResponse = {
  status: 'rejected';
  reason: string;
};

export const allSettled = <T = unknown>(
  iterable: unknown[]
): Promise<Array<FulfillResponse<T> | RejectResponse>> => {
  if (!isIterator(iterable)) {
    throw new Error('[allSettled] first param must be iterable');
  }

  const onFulfill = (v: T): FulfillResponse<T> => ({
    status: 'fulfilled',
    value: v,
  });
  const onReject = (v): RejectResponse => ({ status: 'rejected', reason: v });

  return Promise.all(
    Array.from(iterable).map((p) =>
      Promise.resolve(p).then(onFulfill).catch(onReject)
    )
  );
};

export const isFulfilled = (obj: unknown): obj is FulfillResponse => {
  return (
    (obj as FulfillResponse).status === 'fulfilled' &&
    (obj as FulfillResponse).value != null
  );
};
