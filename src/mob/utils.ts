import { makeAutoObservable, reaction, toJS, isObservable } from 'mobx';
import { useEffect, useState } from 'react';

const noop = (): void => undefined;

enum FieldTypeInternal {
  Effect = 'effect',
  LiveData = 'live_data',
}

export type Lazy<T = void> = () => T;

export type Effect = {
  name: string;
  running: boolean;
  run: Lazy;
  stop: Lazy;
};

export type EffectInternal = Effect & {
  __type: FieldTypeInternal.Effect;
  __manual: boolean;
};

export type CreateEffectOptions = {
  manual?: boolean;
};

export type EffectDisposer = () => void;

export type EffectRunner = () => EffectDisposer;

export const createEffect = (runner: EffectRunner, options?: CreateEffectOptions): Effect => {
  let isRunning = false;
  let dispose = noop;

  const run = () => {
    dispose = runner();
    isRunning = true;
  };

  const stop = () => {
    dispose();
    isRunning = false;
  };

  const effectInternal: EffectInternal = {
    __type: FieldTypeInternal.Effect,
    __manual: options?.manual ?? false,
    name: '',
    get running() {
      return isRunning;
    },
    run,
    stop,
  };

  return effectInternal as Effect;
};

const isEffectInternal = (field: unknown): field is EffectInternal =>
  // @ts-ignore
  field?.__type === FieldTypeInternal.Effect;

export type Class<T> = { new (): T };

const ProcessAfterCreateMap = {
  [FieldTypeInternal.Effect]: (key: string, effect: EffectInternal) => {
    effect.name = key;

    if (!effect.__manual) {
      effect.run();
    }
  },
};

export const createViewModel = <T extends object>(
  Target: Class<T>,
  overrides?: Parameters<typeof makeAutoObservable<T>>[1] | null,
  options?: Parameters<typeof makeAutoObservable<T>>[2] | null,
) => {
  const target = new Target();

  const autoObservableOverrides: Record<string, any> = { ...overrides };
  Object.entries(target).forEach(([key, field]) => {
    if (isEffectInternal(field)) {
      autoObservableOverrides[key] = false;
    }
  });

  const viewModel = makeAutoObservable(target, autoObservableOverrides, options ?? undefined);

  Object.entries(viewModel).forEach(([key, field]) => {
    if (isEffectInternal(field)) {
      ProcessAfterCreateMap[FieldTypeInternal.Effect](key, field);
    }
  });

  return viewModel;
};

const sourceToJS = <T extends Record<string, unknown>>(source: () => T): T => {
  let target: Record<string, unknown> = source();
  if (isObservable(target)) {
    target = toJS(target);
  }

  Object.entries(target).forEach(([key, value]) => {
    target[key] = toJS(value);
  });

  return target as T;
};

export const useObserver = <T extends Record<string, unknown>>(source: () => T): T => {
  const [state, setState] = useState(() => sourceToJS(source));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => reaction(() => sourceToJS(source), setState), []);
  return state;
};
