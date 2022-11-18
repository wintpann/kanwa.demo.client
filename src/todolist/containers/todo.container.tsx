import React, { FC } from 'react';
import { di } from '@kanwa/di';
import { todosViewModel } from '@/todolist/view-models/todos.view-model';
import { Todo } from '@/todolist/components/todo.component';
import { observer } from 'mobx-react-lite';

type TodoContainerProps = {
  text: string;
  checked: boolean;
  id: number;
};

export const TodoContainer = di.record(
  todosViewModel,
  (todosViewModel) =>
    observer(({ text, checked, id }: TodoContainerProps) => (
        <Todo
          text={text}
          checked={checked}
          id={id}
          removeTodo={todosViewModel.remove}
          toggleTodo={todosViewModel.toggle}
        />
      )) as FC<TodoContainerProps>,
);
