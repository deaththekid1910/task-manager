import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TaskBoard from '@/components/TaskBoard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h1 className="text-xl font-bold text-white">TaskManager</h1>
          </div>
          <span className="text-slate-400 text-sm">{user.email}</span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <TaskBoard initialTasks={tasks || []} userId={user.id} />
      </main>
    </div>
  )
}