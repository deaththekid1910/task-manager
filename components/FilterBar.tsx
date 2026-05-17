'use client'

import { Input } from '@/components/ui/input'
import { Status, Priority } from '@/lib/types'

interface Props {
  search: string
  onSearch: (v: string) => void
  priority: Priority | 'all'
  onPriority: (v: Priority | 'all') => void
  status: Status | 'all'
  onStatus: (v: Status | 'all') => void
  tag: string
  onTag: (v: string) => void
  allTags: string[]
}

export default function FilterBar({ search, onSearch, priority, onPriority, status, onStatus, tag, onTag, allTags }: Props) {
  const btnBase = 'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all'
  const active = 'bg-indigo-600 border-indigo-500 text-white'
  const inactive = 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 space-y-3">
      <Input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="🔍 Buscar tareas..."
        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
      />
      <div className="flex flex-wrap gap-2">
        <span className="text-slate-500 text-xs self-center">Prioridad:</span>
        {(['all', 'high', 'medium', 'low'] as const).map(p => (
          <button key={p} onClick={() => onPriority(p)} className={`${btnBase} ${priority === p ? active : inactive}`}>
            {p === 'all' ? 'Todas' : p === 'high' ? '🔴 Alta' : p === 'medium' ? '🟡 Media' : '🟢 Baja'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-slate-500 text-xs self-center">Estado:</span>
        {(['all', 'todo', 'in_progress', 'done'] as const).map(s => (
          <button key={s} onClick={() => onStatus(s)} className={`${btnBase} ${status === s ? active : inactive}`}>
            {s === 'all' ? 'Todos' : s === 'todo' ? '📌 Por hacer' : s === 'in_progress' ? '🔄 En progreso' : '✅ Completado'}
          </button>
        ))}
      </div>
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-slate-500 text-xs self-center">Etiqueta:</span>
          <button onClick={() => onTag('all')} className={`${btnBase} ${tag === 'all' ? active : inactive}`}>Todas</button>
          {allTags.map(t => (
            <button key={t} onClick={() => onTag(t)} className={`${btnBase} ${tag === t ? active : inactive}`}>{t}</button>
          ))}
        </div>
      )}
    </div>
  )
}