import { makeAutoObservable, toJS } from 'mobx';
import { useEffect } from 'react';

type Class<T> = { new (): T };

export const fromClass = <T extends object>(
  Target: Class<T>,
  overrides?: Parameters<typeof makeAutoObservable<T>>[1],
  options?: Parameters<typeof makeAutoObservable<T>>[2],
) => {
  const target = makeAutoObservable(new Target(), overrides, options);
  Object.values(target).forEach((v) => {
    if (v.type === 'effect') {
      v.fn();
    }
  });
  return target;
};

type RemoteData<T, U> = {
  data: T | undefined;
  error: U | undefined;
  status: 'initial' | 'pending' | 'error' | 'success';
};

type LiveData<T, U, Args> = {
  value: RemoteData<T, U>;
  setValue: (data: RemoteData<T, U>) => void;
  fetch: (args: Args) => void;
};

export const liveData = <T, U = Error, Args = void>(
  fetch: (args: Args) => Promise<T>,
): LiveData<T, U, Args> => ({
  value: {
    data: undefined,
    error: undefined,
    status: 'initial',
  },
  setValue(data: RemoteData<T, U>) {
    this.value = data;
  },
  fetch(args: Args) {
    this.setValue({
      data: undefined,
      error: undefined,
      status: 'pending',
    });
    fetch(args)
      .then((v) =>
        this.setValue({
          data: v,
          error: undefined,
          status: 'success',
        }),
      )
      .catch(() => {
        this.setValue({
          data: undefined,
          error: new Error() as U,
          status: 'error',
        });
      });
  },
});

export const useLiveData = <T, U, Args>(
  liveData: LiveData<T, U, Args>,
  args: Args,
): RemoteData<T, U> => {
  useEffect(() => {
    liveData.fetch(args);
  }, []);
  return toJS(liveData.value);
};

export const createEffect = (fn: () => void) => ({
  type: 'effect',
  fn,
});
