'use client'

import { useState } from 'react'
import { Task, Status } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import TaskModal from './TaskModal'
import DroppableColumn from './DroppableColumn'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const columns: { id: Status; label: string; icon: string; color: string }[] = [
  { id: 'todo',        label: 'Por hacer',   icon: '📌', color: 'border-t-slate-500' },
  { id: 'in_progress', label: 'En progreso', icon: '🔄', color: 'border-t-indigo-500' },
  { id: 'done',        label: 'Completado',  icon: '✅', color: 'border-t-green-500' },
]

const priorityConfig = {
  high:   { label: 'Alta',  class: 'bg-red-500/20 text-red-400 border-red-500/30' },
  medium: { label: 'Media', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  low:    { label: 'Baja',  class: 'bg-green-500/20 text-green-400 border-green-500/30' },
}

interface Props {
  initialTasks: Task[]
  userId: string
}

export default function TaskBoard({ initialTasks, userId }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    const overColumn = columns.find(c => c.id === overId)
    const overTask = tasks.find(t => t.id === overId)
    const targetStatus = overColumn ? overColumn.id : overTask?.status

    if (targetStatus && activeTask.status !== targetStatus) {
      setTasks(prev => prev.map(t =>
        t.id === activeId ? { ...t, status: targetStatus as Status } : t
      ))
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    const task = tasks.find(t => t.id === activeId)
    if (!task) return

    const overColumn = columns.find(c => c.id === overId)
    const overTask = tasks.find(t => t.id === overId)
    const targetStatus = overColumn ? overColumn.id : overTask?.status ?? task.status

    setTasks(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId)
      const newIndex = prev.findIndex(t => t.id === overId)
      const updated = prev.map(t =>
        t.id === activeId ? { ...t, status: targetStatus as Status } : t
      )
      return newIndex >= 0 ? arrayMove(updated, oldIndex, newIndex) : updated
    })

    await supabase.from('tasks').update({
      status: targetStatus,
      updated_at: new Date().toISOString()
    }).eq('id', activeId)
  }

  const handleCreate = async (data: { title: string; description: string; priority: Task['priority']; due_date: string | null }) => {
    const { data: newTask } = await supabase
      .from('tasks')
      .insert({ ...data, user_id: userId, status: 'todo' })
      .select()
      .single()
    if (newTask) setTasks(prev => [newTask, ...prev])
  }

  const handleEdit = async (data: { title: string; description: string; priority: Task['priority']; due_date: string | null }) => {
    if (!editingTask) return
    const { data: updated } = await supabase
      .from('tasks')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editingTask.id)
      .select()
      .single()
    if (updated) setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const handleDelete = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const handleSave = (data: { title: string; description: string; priority: Task['priority']; due_date: string | null }) => {
    if (editingTask) handleEdit(data)
    else handleCreate(data)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Mis Tareas</h2>
          <p className="text-slate-400 text-sm mt-1">{tasks.length} tareas en total</p>
        </div>
        <Button
          onClick={() => { setEditingTask(null); setModalOpen(true) }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          + Nueva Tarea
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => (
            <DroppableColumn
              key={col.id}
              id={col.id}
              label={col.label}
              icon={col.icon}
              color={col.color}
              tasks={tasks.filter(t => t.status === col.id)}
              onEdit={(t) => { setEditingTask(t); setModalOpen(true) }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <Card className="bg-slate-800 border-indigo-500 p-4 shadow-2xl shadow-indigo-500/20 rotate-2 scale-105">
              <h3 className="text-white font-medium text-sm mb-2">{activeTask.title}</h3>
              <Badge className={`text-xs border ${priorityConfig[activeTask.priority].class}`}>
                {priorityConfig[activeTask.priority].label}
              </Badge>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  )
}