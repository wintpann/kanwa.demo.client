import { createEffect, fromClass, liveData, useLiveData } from '@/mob/utils';
import { observer } from 'mobx-react-lite';
import { makeAutoObservable, reaction, toJS, when } from 'mobx';
import { useEffect } from 'react';

type Todo = {
  title: string;
};

const getTodos = (): Promise<Todo[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ title: '12' }] as Todo[]);
    }, 2000);
  });

const getTodos2 = (): Promise<Todo[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ title: '12' }] as Todo[]);
    }, 2000);
  });

const vm = fromClass(
  class VM {
    todos = liveData(getTodos);

    todos2 = liveData(getTodos2);

    setUp = async () => {
      await when(() => this.todos2.value.status === 'success');
      console.log('LOOOG DONE!');
    };

    someEffect = createEffect(() => {
      reaction(
        () => this.todos.value.status,
        (status) => {
          console.log('LOOOG status changed', status);
          if (status === 'success') {
            this.todos2.fetch();
          }
        },
      );
    });
  },
);

export const App = observer(() => {
  const todos = useLiveData(vm.todos, undefined);
  console.log('LOOOG todos', todos);
  console.log('LOOOG todos2', toJS(vm.todos2.value));

  useEffect(() => {
    vm.setUp();
  }, []);
  return null;
});
