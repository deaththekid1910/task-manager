export type Status = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  created_at: string
  updated_at: string
}