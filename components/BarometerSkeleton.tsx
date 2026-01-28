'use client'

export function BarometerSkeleton() {
  return (
    <div className="relative mx-auto flex flex-col items-center w-full max-w-[400px]">
      {/* Gauge placeholder — полукруг по высоте как у react-gauge-chart */}
      <div
        className="w-[75%] bg-slate-700/60 rounded-t-full animate-pulse"
        style={{ aspectRatio: '2 / 1' }}
      />
      {/* Legend placeholder */}
      <div className="mt-4 flex w-full justify-between px-4 gap-4">
        <div className="h-4 w-16 rounded bg-slate-700 animate-pulse" />
        <div className="h-4 w-14 rounded bg-slate-700 animate-pulse" />
        <div className="h-4 w-20 rounded bg-slate-700 animate-pulse" />
      </div>
      {/* Stats placeholder */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="h-14 w-24 rounded-lg bg-slate-700 animate-pulse" />
        <div className="h-5 w-56 rounded bg-slate-700/80 animate-pulse" />
        <div className="mt-4 h-9 w-32 rounded-full bg-slate-700 animate-pulse" />
      </div>
    </div>
  )
}
