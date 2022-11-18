import React, { FC, PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';

export const Bootstrap: FC<PropsWithChildren> = observer(({ children }) => (
  <div className="app">{children}</div>
));
