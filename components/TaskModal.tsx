'use client'

import { useState, useEffect } from 'react'
import { Task, Priority } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: { title: string; description: string; priority: Priority }) => void
  task?: Task | null
}

export default function TaskModal({ open, onClose, onSave, task }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
    }
  }, [task, open])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title, description, priority })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-slate-300">Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué hay que hacer?"
              className="mt-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <Label className="text-slate-300">Descripción (opcional)</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles de la tarea..."
              rows={3}
              className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <Label className="text-slate-300">Prioridad</Label>
            <div className="flex gap-2 mt-1">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    priority === p
                      ? p === 'high' ? 'bg-red-500/30 border-red-500 text-red-300'
                        : p === 'medium' ? 'bg-yellow-500/30 border-yellow-500 text-yellow-300'
                        : 'bg-green-500/30 border-green-500 text-green-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {p === 'high' ? '🔴 Alta' : p === 'medium' ? '🟡 Media' : '🟢 Baja'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-500">
              {task ? 'Guardar cambios' : 'Crear tarea'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}