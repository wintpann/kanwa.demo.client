import { di } from '@kanwa/di';
import { makeAutoObservable } from 'mobx';
import { notificationService } from '@/todolist/services/notification.service';
import { todosViewModel } from '@/todolist/view-models/todos.view-model';

export type TopBarViewModel = {
  text: string;
  setText: (text: string) => void;
  createTodo: () => void;
};

export const topBarViewModel = di
  .record(notificationService, todosViewModel, (notificationService, todosViewModel) =>
    makeAutoObservable<TopBarViewModel>(
      {
        text: '',
        setText(text: string) {
          this.text = text;
        },
        createTodo() {
          const textTrimmed = this.text.trim();
          if (textTrimmed === '') {
            notificationService.warn('No text!');
            return;
          }

          todosViewModel.create(this.text);
          this.setText('');
        },
      },
      {},
      { autoBind: true },
    ),
  )
  .alterBy('topBarViewModel');
