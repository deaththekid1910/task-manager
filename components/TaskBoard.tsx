'use client'

import { useState } from 'react'
import { Task, Status } from '@/lib/types'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const columns: { id: Status; label: string; icon: string; color: string }[] = [
  { id: 'todo',        label: 'Por hacer',    icon: '📌', color: 'border-t-slate-500' },
  { id: 'in_progress', label: 'En progreso',  icon: '🔄', color: 'border-t-indigo-500' },
  { id: 'done',        label: 'Completado',   icon: '✅', color: 'border-t-green-500' },
]

interface Props {
  initialTasks: Task[]
  userId: string
}

export default function TaskBoard({ initialTasks, userId }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const supabase = createClient()

  const handleCreate = async (data: { title: string; description: string; priority: Task['priority'] }) => {
    const { data: newTask } = await supabase
      .from('tasks')
      .insert({ ...data, user_id: userId, status: 'todo' })
      .select()
      .single()
    if (newTask) setTasks(prev => [newTask, ...prev])
  }

  const handleEdit = async (data: { title: string; description: string; priority: Task['priority'] }) => {
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

  const handleMove = async (id: string, status: Status) => {
    await supabase.from('tasks').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const handleSave = (data: { title: string; description: string; priority: Task['priority'] }) => {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id)
          return (
            <div key={col.id} className={`bg-slate-900 rounded-xl border-t-4 ${col.color} border border-slate-800 p-4`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span>{col.icon}</span>
                  <h3 className="text-white font-semibold text-sm">{col.label}</h3>
                </div>
                <span className="bg-slate-800 text-slate-400 text-xs font-medium px-2 py-1 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(t) => { setEditingTask(t); setModalOpen(true) }}
                    onDelete={handleDelete}
                    onMove={handleMove}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-sm">
                    Sin tareas aquí
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  )
}