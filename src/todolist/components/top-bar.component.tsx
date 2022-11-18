import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

export type TopBarProps = {
  text: string;
  setText: (text: string) => void;
  onEnterClick: () => void;
};

export const TopBar: FC<TopBarProps> = observer(({ text, setText, onEnterClick }) => (
  <div className="top-bar">
    <input
      className="top-bar_input ellipsis"
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyPress={(e) => {
        const isEnter = e.key === 'Enter';
        if (isEnter) onEnterClick();
      }}
      placeholder="New todo"
    />
  </div>
));
