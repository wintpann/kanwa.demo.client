import {
  action,
  autorun,
  configure,
  makeAutoObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
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

    // @ts-ignore
    window.increaseSource = () => subscriber.next(subscriber.value + 1);

    return {
      start: () => {
        interval = window.setInterval(() => {
          console.log('LOOOG source updated')
          subscriber.next(subscriber.value + 1);
        }, ms);
      },
      pause: () => {
        clearInterval(interval);
      },
      resume: () => {
        console.log('LOOOG next value');
        subscriber.next(subscriber.value + 1);

        interval = window.setInterval(() => {
          console.log('LOOOG interval');
          subscriber.next(subscriber.value + 1);
        }, ms);
      },
    };
  });

const source = interval(1000);

const doubled = new Observable(source.value * 2, (subscriber) => {
  let dispose: (() => void) | undefined;
  return {
    start: () => {
      console.log('LOOOG start doubled');
      subscriber.next(source.value * 2);
      dispose = reaction(
        () => source.value,
        (value) => {
          console.log('LOOOG doubled next');
          subscriber.next(value * 2);
        },
      );
    },
    pause: () => {
      dispose?.();
      dispose = undefined;
    },
  };
});

// @ts-ignore
window.run = () => {
  const stop = autorun(() => {
    console.log('LOOOG subscription')
    console.log('LOOOG value read', doubled.value);
  });

  // @ts-ignore
  window.stop = stop;
};

// @ts-ignore
window.doubled = doubled;
// @ts-ignore
window.source = source;
