export type Status = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Subtask {
  id: string
  task_id: string
  user_id: string
  title: string
  completed: boolean
  created_at: string
}

export interface Comment {
  id: string
  task_id: string
  user_id: string
  content: string
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  tags: string[]
  subtasks?: Subtask[]
  comments?: Comment[]
  created_at: string
  updated_at: string
}