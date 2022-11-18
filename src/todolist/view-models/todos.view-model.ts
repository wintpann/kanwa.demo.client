import { di } from '@kanwa/di';
import { Filter } from '@/todolist/const';
import { makeAutoObservable } from 'mobx';

export type Todo = {
  id: number;
  text: string;
  checked: boolean;
};

export type TodosViewModel = {
  todos: Todo[];
  filter: Filter;
  shownTodos: Todo[];
  setFilter: (filter: Filter) => void;
  create: (text: string) => void;
  toggle: (id: number) => void;
  remove: (id: number) => void;
};

export const todosViewModel = di
  .record(() =>
    makeAutoObservable<TodosViewModel>(
      {
        todos: [],
        filter: Filter.All,
        get shownTodos() {
          if (this.filter === Filter.Checked)
            return this.todos.filter((todo: Todo) => todo.checked);
          if (this.filter === Filter.Unchecked)
            return this.todos.filter((todo: Todo) => !todo.checked);

          return this.todos;
        },
        setFilter(filter: Filter) {
          this.filter = filter;
        },
        create(text: string) {
          this.todos.push({ text, id: Date.now(), checked: false });
        },
        toggle(id: number) {
          const todo = this.todos.find((todo: Todo) => todo.id === id);
          if (todo) {
            todo.checked = !todo.checked;
          }
        },
        remove(id: number) {
          const todoIndex = this.todos.findIndex((todo: Todo) => todo.id === id);
          console.log('LOOOG', todoIndex);
          if (todoIndex) {
            console.log('LOOOG', this.todos);
            this.todos.splice(todoIndex, 1);
            console.log('LOOOG', this.todos);
          }
        },
      },
      {},
      { autoBind: true },
    ),
  )
  .alterBy('todosViewModel');
