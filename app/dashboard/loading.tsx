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
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="w-32 h-7 bg-slate-800 rounded animate-pulse mb-2"/>
            <div className="w-24 h-4 bg-slate-800 rounded animate-pulse"/>
          </div>
          <div className="w-32 h-10 bg-slate-800 rounded-lg animate-pulse"/>
        </div>
        <div className="w-full h-20 bg-slate-900 border border-slate-800 rounded-xl animate-pulse mb-6"/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[400px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-slate-800 rounded animate-pulse"/>
                <div className="w-24 h-4 bg-slate-800 rounded animate-pulse"/>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="bg-slate-800 rounded-lg p-4 animate-pulse">
                    <div className="w-3/4 h-4 bg-slate-700 rounded mb-2"/>
                    <div className="w-1/2 h-3 bg-slate-700 rounded"/>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}