import {
  action,
  autorun,
  makeAutoObservable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
} from 'mobx';

type Subscription = {
  start: () => void;
  pause: () => void;
  resume?: () => void;
};

type Subscribe<T> = (subscriber: { next: (value: T) => void; value: T }) => Subscription;

class Observable<T> {
  value: T;

  next = action((value: T) => {
    this.value = value;
  });

  _isStarted = false;

  _subscription: Subscription | undefined;

  constructor(initial: T, subscribe: Subscribe<T>) {
    this.value = initial;

    makeAutoObservable(this);

    onBecomeObserved(this, 'value', this._createOnObserved(subscribe));
    onBecomeUnobserved(this, 'value', this._onUnobserved);
  }

  _onUnobserved = () => {
    this._subscription!.pause();
  };

  _createOnObserved = (subscribe: Subscribe<T>) => () => {
    const getValue = () => this.value;

    if (!this._subscription) {
      this._subscription = subscribe({
        next: this.next,
        get value() {
          return getValue();
        },
      });
    }

    if (this._isStarted && this._subscription.resume) {
      this._subscription.resume();
    } else {
      this._subscription.start();
      this._isStarted = true;
    }
  };

  pipe = <U>(fn: (source: Observable<T>) => Observable<U>): Observable<U> => {
    return fn(this as unknown as Observable<T>);
  };
}

const map =
  <T, U>(fn: (value: T) => U) =>
  (source: Observable<T>) =>
    new Observable(fn(source.value), (subscriber) => {
      let dispose: (() => void) | undefined;
      return {
        start: () => {
          subscriber.next(fn(source.value));
          dispose = reaction(
            () => source.value,
            (value) => {
              subscriber.next(fn(value));
            },
          );
        },
        pause: () => {
          dispose?.();
          dispose = undefined;
        },
      };
    });

const interval = (ms: number) =>
  new Observable(0, (subscriber) => {
    let interval: number;

    return {
      start: () => {
        interval = window.setInterval(() => {
          subscriber.next(subscriber.value + 1);
        }, ms);
      },
      pause: () => {
        clearInterval(interval);
      },
      resume: () => {
        subscriber.next(subscriber.value + 1);

        interval = window.setInterval(() => {
          subscriber.next(subscriber.value + 1);
        }, ms);
      },
    };
  });

const source = interval(1000);
const doubled = source.pipe(map((v) => v * 2));

// @ts-ignore
window.run = () => {
  const stop = autorun(() => {
    console.log('LOOOG doubled read', doubled.value);
  });

  // @ts-ignore
  window.stop = stop;
};
