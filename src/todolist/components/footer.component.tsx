import React, { FC } from 'react';
import { Filter } from '@/todolist/const';
import { observer } from 'mobx-react-lite';

type FooterProps = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

export const Footer: FC<FooterProps> = observer(({ filter, setFilter }) => (
  <div className="footer">
    <input
      id="label-all"
      type="radio"
      name="filter"
      value={Filter.All}
      onChange={(e) => setFilter(e.target.value as Filter)}
      checked={filter === Filter.All}
    />
    <label className="footer_label" htmlFor="label-all">
      All
    </label>
    <input
      id="label-checked"
      type="radio"
      name="filter"
      value={Filter.Checked}
      onChange={(e) => setFilter(e.target.value as Filter)}
      checked={filter === Filter.Checked}
    />
    <label className="footer_label" htmlFor="label-checked">
      Done
    </label>
    <input
      id="label-unchecked"
      type="radio"
      name="filter"
      value={Filter.Unchecked}
      onChange={(e) => setFilter(e.target.value as Filter)}
      checked={filter === Filter.Unchecked}
    />
    <label className="footer_label" htmlFor="label-unchecked">
      Remaining
    </label>
  </div>
));
