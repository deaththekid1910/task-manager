import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, Status } from '@/lib/types'
import TaskCard from './TaskCard'

interface Props {
  id: Status
  label: string
  icon: string
  color: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export default function DroppableColumn({ id, label, icon, color, tasks, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`bg-slate-900 rounded-xl border-t-4 ${color} border transition-all ${
        isOver ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-slate-800'
      } p-4 min-h-[400px]`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <h3 className="text-white font-semibold text-sm">{label}</h3>
        </div>
        <span className="bg-slate-800 text-slate-400 text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {tasks.length === 0 && (
            <div className={`text-center py-12 rounded-lg border-2 border-dashed transition-all ${
              isOver ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700 text-slate-600'
            } text-sm`}>
              {isOver ? '✨ Suelta aquí' : 'Sin tareas'}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}