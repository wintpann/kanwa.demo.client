import React, { useState } from 'react';
import { di } from '@kanwa/di';
import { injectStores } from '@mobx-devtools/tools';
import { createViewModel, createEffect, useObserver, Effect, component } from '@/mob/utils';
import { reaction, toJS } from 'mobx';

type Todo = {
  title: string;
  checked: boolean;
  id: number;
};

const createTodo = (title: string): Todo => ({ title, checked: false, id: Date.now() });

export type TodosViewModel = {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  onTodosChanged: Effect;
};

const todosViewModel = di.record(
  (): TodosViewModel =>
    createViewModel(
      class TodosViewModel {
        todos: Todo[] = [];

        addTodo = (title: string) => {
          this.todos = [...this.todos, createTodo(title)];
        };

        toggleTodo = (id: number) => {
          const todo = this.todos[this.todos.findIndex((todo) => todo.id === id)];
          if (todo) {
            todo.checked = !todo.checked;
          }
        };

        onTodosChanged = createEffect(() =>
          reaction(
            () => toJS(this.todos),
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

const TodoItem = component<{ todo: Todo; toggle: (id: number) => void }>(
  'TodoItem',
  ({ todo, toggle }) => (
    <div>
      <div>{todo.title}</div>
      <div onClick={() => toggle(todo.id)}>checked: {String(todo.checked)}</div>
    </div>
  ),
);

const Input = di.record(todosViewModel, (todosViewModel) =>
  component('Input', () => {
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
  }),
);

const AppRecord = di.record(todosViewModel, Input, (todosViewModel, Input) => () => {
  const { todos } = useObserver(() => ({ todos: todosViewModel.todos }));

  return (
    <div>
      <Input />
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} toggle={todosViewModel.toggleTodo} />
      ))}
    </div>
  );
});

export const App = AppRecord();
