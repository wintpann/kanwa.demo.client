import React, { FC } from 'react';
import { di } from '@kanwa/di';
import { Footer } from '@/todolist/components/footer.component';
import { todosViewModel } from '@/todolist/view-models/todos.view-model';
import { observer } from 'mobx-react-lite';

export const FooterContainer = di.record(
  todosViewModel,
  (todosViewModel) =>
    observer(() => (
      <Footer filter={todosViewModel.filter} setFilter={todosViewModel.setFilter} />
    )) as FC,
);
