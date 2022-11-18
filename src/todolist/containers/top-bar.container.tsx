import React, { FC } from 'react';
import { di } from '@kanwa/di';
import { TopBar } from '@/todolist/components/top-bar.component';
import { topBarViewModel } from '@/todolist/view-models/top-bar.view-model';
import { observer } from 'mobx-react-lite';

export const TopBarContainer = di.record(
  topBarViewModel,
  (topBarViewModel) =>
    observer(() => (
      <TopBar
        text={topBarViewModel.text}
        setText={topBarViewModel.setText}
        onEnterClick={topBarViewModel.createTodo}
      />
    )) as FC,
);
