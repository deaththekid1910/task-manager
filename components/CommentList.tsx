'use client'

import { useState } from 'react'
import { Comment } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface Props {
  taskId: string
  userId: string
  comments: Comment[]
  onChange: (comments: Comment[]) => void
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'hace un momento'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
}

export default function CommentList({ taskId, userId, comments, onChange }: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const addComment = async () => {
    if (!input.trim()) return
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .insert({ content: input.trim(), task_id: taskId, user_id: userId })
      .select()
      .single()
    if (data) onChange([...comments, data])
    setInput('')
    setLoading(false)
  }

  const deleteComment = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id)
    onChange(comments.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-3">
      {comments.length === 0 && (
        <p className="text-slate-500 text-xs text-center py-2">Sin comentarios aún</p>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {comments.map(c => (
          <div key={c.id} className="group bg-slate-700/50 rounded-lg px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-indigo-400 text-xs font-medium">Tú</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">{timeAgo(c.created_at)}</span>
                <button
                  onClick={() => deleteComment(c.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 text-xs transition-opacity"
                >×</button>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) addComment()
          }}
          placeholder="Escribe un comentario... (Ctrl+Enter para enviar)"
          rows={2}
          className="w-full rounded-md bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button
          onClick={addComment}
          disabled={loading || !input.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 h-8 text-sm"
        >
          {loading ? 'Enviando...' : 'Comentar'}
        </Button>
      </div>
    </div>
  )
}