import {
  action,
  autorun,
  configure,
  makeAutoObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  toJS,
} from 'mobx';

type Subscription = {
  start: () => void;
  pause: () => void;
  resume?: () => void;
};

class Observable<T> {
  value: T;

  constructor(
    initial: T,
    subscribe: (subscriber: { next: (value: T) => void; value: T }) => Subscription,
  ) {
    this.value = initial;

    const next = (value: T) => {
      this.value = value;
    };
    const nextAction = action(next);
    const getValue = () => this.value;

    let subscription: Subscription | undefined;
    let isStarted = false;

    makeAutoObservable(this);

    const onObserved = () => {
      if (!subscription) {
        subscription = subscribe({
          next: nextAction,
          get value() {
            return getValue();
          },
        });
      }

      if (isStarted && subscription.resume) {
        subscription.resume();
      } else {
        subscription.start();
      }

      isStarted = true;
    };

    const onUnobserved = () => {
      subscription!.pause();
    };

    onBecomeObserved(this, 'value', onObserved);
    onBecomeUnobserved(this, 'value', onUnobserved);
  }
}

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

const source = interval(200);

const stop = autorun(() => {
  console.log('LOOOG value read', source.value);
});

setTimeout(() => {
  stop();
}, 1000);