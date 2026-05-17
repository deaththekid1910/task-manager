'use client'

import { useMemo } from 'react'
import { Task } from '@/lib/types'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

interface Props {
  tasks: Task[]
}

const STATUS_COLORS = {
  todo: '#64748b',
  in_progress: '#6366f1',
  done: '#22c55e',
}

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#eab308',
  low: '#22c55e',
}

const STATUS_LABELS = {
  todo: 'Por hacer',
  in_progress: 'En progreso',
  done: 'Completado',
}

const PRIORITY_LABELS = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

export default function AnalyticsDashboard({ tasks }: Props) {
  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.status === 'done').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const todo = tasks.filter(t => t.status === 'todo').length
    const overdue = tasks.filter(t => {
      if (!t.due_date || t.status === 'done') return false
      return new Date(t.due_date) < new Date()
    }).length
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

    const byStatus = [
      { name: 'Por hacer', value: todo, color: STATUS_COLORS.todo },
      { name: 'En progreso', value: inProgress, color: STATUS_COLORS.in_progress },
      { name: 'Completado', value: done, color: STATUS_COLORS.done },
    ]

    const byPriority = [
      { name: 'Alta', value: tasks.filter(t => t.priority === 'high').length, color: PRIORITY_COLORS.high },
      { name: 'Media', value: tasks.filter(t => t.priority === 'medium').length, color: PRIORITY_COLORS.medium },
      { name: 'Baja', value: tasks.filter(t => t.priority === 'low').length, color: PRIORITY_COLORS.low },
    ]

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const label = date.toLocaleDateString('es', { weekday: 'short' })
      const dayStr = date.toISOString().split('T')[0]
      const created = tasks.filter(t => t.created_at.startsWith(dayStr)).length
      const completed = tasks.filter(t => t.status === 'done' && t.updated_at.startsWith(dayStr)).length
      return { label, created, completed }
    })

    const allTags = tasks.flatMap(t => t.tags || [])
    const tagCount = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))

    return { total, done, inProgress, todo, overdue, completionRate, byStatus, byPriority, last7Days, topTags }
  }, [tasks])

  const StatCard = ({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total tareas" value={stats.total} color="text-white" />
        <StatCard label="Completadas" value={stats.done} sub={`${stats.completionRate}% completado`} color="text-green-400" />
        <StatCard label="En progreso" value={stats.inProgress} color="text-indigo-400" />
        <StatCard label="Vencidas" value={stats.overdue} sub="sin completar" color="text-red-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Tareas por estado</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.byStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {stats.byStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              />
              <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Tareas por prioridad</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byPriority} barSize={40}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {stats.byPriority.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Actividad últimos 7 días</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.last7Days} barSize={20} barGap={4}>
            <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
            <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value === 'created' ? 'Creadas' : 'Completadas'}</span>} />
            <Bar dataKey="created" name="created" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {stats.topTags.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Etiquetas más usadas</h3>
          <div className="space-y-2">
            {stats.topTags.map(tag => (
              <div key={tag.name} className="flex items-center gap-3">
                <span className="text-slate-300 text-sm w-24">{tag.name}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${(tag.value / stats.total) * 100}%` }}
                  />
                </div>
                <span className="text-slate-400 text-xs w-6 text-right">{tag.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}