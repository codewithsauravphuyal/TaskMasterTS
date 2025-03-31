export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}