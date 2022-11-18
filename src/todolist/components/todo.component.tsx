import React, { FC } from 'react';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { ReactComponent as CrossSvg } from '../assets/icon_cross.svg';

type TodoProps = {
  text: string;
  checked: boolean;
  id: number;
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
};

export const Todo: FC<TodoProps> = observer(({ text, checked, id, removeTodo, toggleTodo }) => {
  const onToggle = () => toggleTodo(id);
  const onDelete = () => removeTodo(id);

  return (
    <div className="todo">
      <input
        type="checkbox"
        id={`todo-${id}`}
        className="visually_hidden"
        checked={checked}
        onChange={onToggle}
      />
      <label
        title={text}
        htmlFor={`todo-${id}`}
        className={cx('todo-text', { 'todo-text_checked': checked })}
      >
        <span className="hidden-scroll">{text}</span>
      </label>
      <span className="todo_cross" onClick={onDelete}>
        <CrossSvg />
      </span>
    </div>
  );
});
