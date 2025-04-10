import { create, StateCreator } from 'zustand'

export interface Task {
  id: string
  text: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
}

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id'>) => void
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void
}

type TaskStateCreator = StateCreator<TaskStore>

export const useTaskStore = create<TaskStore>((set: TaskStateCreator) => ({
  tasks: [],
  addTask: (task: Omit<Task, 'id'>) => {
    set((state: TaskStore) => ({
      tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }]
    }))
  },
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => {
    set((state: TaskStore) => ({
      tasks: state.tasks.map((task: Task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    }))
  }
})) 