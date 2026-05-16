import { Task } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const priorityConfig = {
  high:   { label: 'Alta',  class: 'bg-red-500/20 text-red-400 border-red-500/30' },
  medium: { label: 'Media', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  low:    { label: 'Baja',  class: 'bg-green-500/20 text-green-400 border-green-500/30' },
}

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const priority = priorityConfig[task.priority]

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="bg-slate-800 border-slate-700 p-4 group hover:border-indigo-500/50 transition-all select-none">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-white font-medium text-sm leading-snug flex-1">{task.title}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onEdit(task) }}
              className="text-slate-400 hover:text-white text-xs px-1"
            >✏️</button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
              className="text-slate-400 hover:text-red-400 text-xs px-1"
            >🗑️</button>
          </div>
        </div>

        {task.description && (
          <p className="text-slate-400 text-xs mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <Badge className={`text-xs border ${priority.class}`}>{priority.label}</Badge>
          <span className="text-slate-600 text-xs">⠿ arrastrar</span>
        </div>
      </Card>
    </div>
  )
}