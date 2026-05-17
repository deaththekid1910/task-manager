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
  onSave: (data: { title: string; description: string; priority: Priority; due_date: string | null; tags: string[] }) => void
  task?: Task | null
}

const PRESET_TAGS = ['diseño', 'dev', 'marketing', 'urgente', 'revisión', 'bug', 'mejora']

export default function TaskModal({ open, onClose, onSave, task }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
      setTags(task.tags || [])
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setTags([])
    }
    setTagInput('')
  }, [task, open])

  const addTag = (tag: string) => {
    const clean = tag.trim().toLowerCase()
    if (clean && !tags.includes(clean)) setTags(prev => [...prev, clean])
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      title,
      description,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      tags,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
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
            <Label className="text-slate-300">Fecha límite (opcional)</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 bg-slate-800 border-slate-700 text-white [color-scheme:dark]"
            />
          </div>
          <div>
            <Label className="text-slate-300">Etiquetas</Label>
            <div className="mt-1 flex flex-wrap gap-1 mb-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2 py-1 rounded-full">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe y presiona Enter..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {PRESET_TAGS.filter(t => !tags.includes(t)).map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 px-2 py-1 rounded-full transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
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