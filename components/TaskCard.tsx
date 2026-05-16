import { Task } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const priorityConfig = {
  high:   { label: 'Alta',  class: 'bg-red-500/20 text-red-400 border-red-500/30' },
  medium: { label: 'Media', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  low:    { label: 'Baja',  class: 'bg-green-500/20 text-green-400 border-green-500/30' },
}

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Task['status']) => void
}

export default function TaskCard({ task, onEdit, onDelete, onMove }: Props) {
  const priority = priorityConfig[task.priority]

  return (
    <Card className="bg-slate-800 border-slate-700 p-4 group hover:border-slate-600 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-white font-medium text-sm leading-snug flex-1">{task.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="text-slate-400 hover:text-white text-xs px-1">✏️</button>
          <button onClick={() => onDelete(task.id)} className="text-slate-400 hover:text-red-400 text-xs px-1">🗑️</button>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <Badge className={`text-xs border ${priority.class}`}>{priority.label}</Badge>
        <div className="flex gap-1">
          {task.status !== 'todo' && (
            <button
              onClick={() => onMove(task.id, task.status === 'in_progress' ? 'todo' : 'in_progress')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >◀</button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => onMove(task.id, task.status === 'todo' ? 'in_progress' : 'done')}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >▶</button>
          )}
        </div>
      </div>
    </Card>
  )
}