export type Priority = 'high' | 'medium' | 'low'

export type Todo = {
  id: string
  text: string
  done: boolean
  dueDate?: string
  priority: Priority
  createdAt: number
}
