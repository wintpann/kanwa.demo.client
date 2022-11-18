import React, { FC } from 'react';
import { di } from '@kanwa/di';
import { todosViewModel } from '@/todolist/view-models/todos.view-model';
import { TodoContainer } from '@/todolist/containers/todo.container';
import { List } from '@/todolist/components/list.component';
import { observer } from 'mobx-react-lite';

export const ListContainer = di.record(
  todosViewModel,
  TodoContainer,
  (todosViewModel, TodoContainer) =>
    observer(() => (
      <List shownTodos={todosViewModel.shownTodos} TodoContainer={TodoContainer} />
    )) as FC,
);
