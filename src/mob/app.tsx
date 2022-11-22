import React, { FC, useState } from 'react';
import { di } from '@kanwa/di';
import { injectStores } from '@mobx-devtools/tools';
import { createViewModel, createEffect, useObserver, Effect } from '@/mob/utils';
import { reaction } from 'mobx';

type Todo = {
  title: string;
  checked: boolean;
  id: number;
};

const createTodo = (title: string): Todo => ({ title, checked: false, id: Date.now() });

export type TodosViewModel = {
  todos: Todo[];
  addTodo: (title: string) => void;
  onTodosChanged: Effect;
};

const todosViewModel = di.record(
  (): TodosViewModel =>
    createViewModel(
      class TodosViewModel {
        todos: Todo[] = [];

        addTodo = (title: string) => {
          this.todos.push(createTodo(title));
        };

        onTodosChanged = createEffect(() =>
          reaction(
            () => this.todos.length,
            () => {
              console.log('LOOOG todos changed reaction');
            },
          ),
        );
      },
    ),
);

const store = todosViewModel();
// @ts-ignore
window.store = store;
injectStores({ store });

const TodoItem: FC<{ todo: Todo }> = ({ todo }) => <div>{todo.title}</div>;

const Input = di.record(todosViewModel, (todosViewModel) => () => {
  const [value, setValue] = useState('');

  const create = () => {
    todosViewModel.addTodo(value);
    setValue('');
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            create();
          }
        }}
      />
      <button onClick={create}>create</button>
    </div>
  );
});

const AppRecord = di.record(todosViewModel, Input, (todosViewModel, Input) => () => {
  const { todos } = useObserver(() => ({ todos: todosViewModel.todos }));

  return (
    <div>
      <Input />
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
});

export const App = AppRecord();
