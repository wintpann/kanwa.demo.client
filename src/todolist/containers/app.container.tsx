import React from 'react';
import { di } from '@kanwa/di';
import { Bootstrap } from '@/todolist/components/bootstrap.component';
import { FooterContainer } from '@/todolist/containers/footer.container';
import { ListContainer } from '@/todolist/containers/list.container';
import { TopBarContainer } from '@/todolist/containers/top-bar.container';

export const AppContainer = di.record(
  TopBarContainer,
  ListContainer,
  FooterContainer,
  (TopBarContainer, ListContainer, FooterContainer) => () =>
    (
      <Bootstrap>
        <TopBarContainer />
        <ListContainer />
        <FooterContainer />
      </Bootstrap>
    ),
);
