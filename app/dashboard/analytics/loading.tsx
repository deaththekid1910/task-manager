export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">📋</span>
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-slate-800 rounded-lg animate-pulse"/>
              <div className="w-20 h-8 bg-slate-800 rounded-lg animate-pulse"/>
            </div>
          </div>
          <div className="w-32 h-4 bg-slate-800 rounded animate-pulse"/>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="w-32 h-7 bg-slate-800 rounded animate-pulse mb-2"/>
          <div className="w-48 h-4 bg-slate-800 rounded animate-pulse"/>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse">
              <div className="w-24 h-3 bg-slate-800 rounded mb-3"/>
              <div className="w-16 h-8 bg-slate-800 rounded"/>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-64 animate-pulse">
              <div className="w-32 h-4 bg-slate-800 rounded mb-4"/>
              <div className="w-full h-48 bg-slate-800 rounded"/>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-64 animate-pulse">
          <div className="w-48 h-4 bg-slate-800 rounded mb-4"/>
          <div className="w-full h-48 bg-slate-800 rounded"/>
        </div>
      </main>
    </div>
  )
}