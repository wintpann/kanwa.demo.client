import React, { FC } from 'react';
import { Todo } from '@/todolist/view-models/todos.view-model';
import { observer } from 'mobx-react-lite';

export type ListProps = {
  shownTodos: Todo[];
  TodoContainer: FC<{
    text: string;
    checked: boolean;
    id: number;
  }>;
};

export const List: FC<ListProps> = observer(({ shownTodos, TodoContainer }) => (
  <div className="todos-list">
    {shownTodos.map((todo) => (
      <TodoContainer key={todo.id} id={todo.id} text={todo.text} checked={todo.checked} />
    ))}
  </div>
));
