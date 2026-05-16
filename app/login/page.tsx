'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError('Revisa tu email para confirmar tu cuenta.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="text-3xl mb-2">📋</div>
            <h1 className="text-2xl font-bold text-white">TaskManager</h1>
            <p className="text-slate-400 text-sm mt-1">
              {isRegister ? 'Crea tu cuenta' : 'Inicia sesión para continuar'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Email</Label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <Label className="text-slate-300">Contraseña</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            >
              {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
            </Button>

            <button
              onClick={() => setIsRegister(!isRegister)}
              className="w-full text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}