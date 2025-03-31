'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '@/lib/types/task';
import { loadTasks, saveTasks } from '@/lib/storage';

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  filter: 'All' | 'Completed' | 'Pending';
  setFilter: (filter: 'All' | 'Completed' | 'Pending') => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    if (isMounted) {
      saveTasks(tasks);
    }
  }, [tasks, isMounted]);

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    setTasks(prev => [
      ...prev,
      {
        ...task,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, filter, setFilter }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};