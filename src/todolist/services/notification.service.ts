import { toast } from 'react-toastify';
import { di } from '@kanwa/di';

export type NotificationService = {
  warn: (text: string) => void;
};

export const notificationService = di.record(
  (): NotificationService => ({
    warn: (text: string) => toast.warn(text),
  }),
);
