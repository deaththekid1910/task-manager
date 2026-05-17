'use client'

import { useState } from 'react'
import { Subtask } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'

interface Props {
  taskId: string
  userId: string
  subtasks: Subtask[]
  onChange: (subtasks: Subtask[]) => void
}

export default function SubtaskList({ taskId, userId, subtasks, onChange }: Props) {
  const [input, setInput] = useState('')
  const supabase = createClient()

  const addSubtask = async () => {
    if (!input.trim()) return
    const { data } = await supabase
      .from('subtasks')
      .insert({ title: input.trim(), task_id: taskId, user_id: userId, completed: false })
      .select()
      .single()
    if (data) onChange([...subtasks, data])
    setInput('')
  }

  const toggleSubtask = async (id: string, completed: boolean) => {
    await supabase.from('subtasks').update({ completed }).eq('id', id)
    onChange(subtasks.map(s => s.id === id ? { ...s, completed } : s))
  }

  const deleteSubtask = async (id: string) => {
    await supabase.from('subtasks').delete().eq('id', id)
    onChange(subtasks.filter(s => s.id !== id))
  }

  const completed = subtasks.filter(s => s.completed).length
  const total = subtasks.length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-3">
      {total > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progreso</span>
            <span>{completed}/{total}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        {subtasks.map(s => (
          <div key={s.id} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={s.completed}
              onChange={(e) => toggleSubtask(s.id, e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-700 accent-indigo-500 cursor-pointer"
            />
            <span className={`flex-1 text-sm ${s.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
              {s.title}
            </span>
            <button
              onClick={() => deleteSubtask(s.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 text-xs transition-opacity"
            >×</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
          placeholder="Agregar subtarea..."
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm h-8"
        />
        <button
          onClick={addSubtask}
          className="text-indigo-400 hover:text-indigo-300 text-sm px-2 border border-slate-700 rounded-md hover:border-indigo-500 transition-colors"
        >+</button>
      </div>
    </div>
  )
}