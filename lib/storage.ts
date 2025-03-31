import { Task } from '@/lib/types/task';

export const saveTasks = (tasks: Task[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
};

export const loadTasks = (): Task[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  }
  return [];
};