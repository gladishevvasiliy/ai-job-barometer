'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import GaugeChart from 'react-gauge-chart'

export interface BarometerVariantProps {
  percentage: number // 0-100 (percentage of red votes)
  isRevealed: boolean
  totalVotes: number
  workingCount: number
  aiReplacedCount: number
  isLoading?: boolean
}

const DURATION_MS = 1000

function animateValue(
  from: number,
  to: number,
  durationMs: number,
  onUpdate: (value: number) => void
) {
  const start = performance.now()
  const run = (now: number) => {
    const elapsed = now - start
    const t = Math.min(1, elapsed / durationMs)
    const eased = 1 - (1 - t) ** 2 // easeOutQuad
    const value = Math.round(from + (to - from) * eased)
    onUpdate(value)
    if (t < 1) requestAnimationFrame(run)
  }
  requestAnimationFrame(run)
}

export function BarometerVariantClassic({ percentage, isRevealed, totalVotes, workingCount, aiReplacedCount, isLoading }: BarometerVariantProps) {
  const clamped = Math.max(0, Math.min(100, percentage))
  const gaugePercent = clamped / 100

  const [displayedTotal, setDisplayedTotal] = useState(0)
  const [displayedWorking, setDisplayedWorking] = useState(0)
  const [displayedReplaced, setDisplayedReplaced] = useState(0)

  useEffect(() => {
    if (isLoading) return
    animateValue(displayedTotal, totalVotes, DURATION_MS, setDisplayedTotal)
    // displayedTotal intentionally omitted so animation runs once per target change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalVotes, isLoading])

  useEffect(() => {
    if (isLoading) return
    animateValue(displayedWorking, workingCount, DURATION_MS, setDisplayedWorking)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workingCount, isLoading])

  useEffect(() => {
    if (isLoading) return
    animateValue(displayedReplaced, aiReplacedCount, DURATION_MS, setDisplayedReplaced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiReplacedCount, isLoading])

  return (
    <div className="relative flex flex-col items-center">
      {/* Container with Blur */}
      <div className={clsx(
        "relative w-full max-w-[400px] transition-all duration-1000 ease-out",
        !isRevealed && "blur-[12px] select-none pointer-events-none"
      )}>
        {/* Gauge Chart */}
        <div className="w-full max-w-[400px]">
          <GaugeChart
            id="ai-job-barometer-gauge"
            nrOfLevels={3}
            arcsLength={[1 / 3, 1 / 3, 1 / 3]}
            colors={['#22c55e', '#eab308', '#ef4444']}
            arcWidth={0.3}
            percent={isLoading ? 0.5 : gaugePercent}
            hideText
            needleColor="#e5e7eb"
            needleBaseColor="#e5e7eb"
            animate={isRevealed && !isLoading}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-between items-center gap-3 px-2 sm:px-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-green-400 whitespace-nowrap shrink-0">Working {isLoading ? '…' : isRevealed ? displayedWorking.toLocaleString() : '—'}</span>
          <span className="text-red-400 whitespace-nowrap shrink-0">AI Replaced {isLoading ? '…' : isRevealed ? displayedReplaced.toLocaleString() : '—'}</span>
        </div>
      </div>

      {/* Reveal Overlay */}
      {!isRevealed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-slate-800/90 px-6 py-3 shadow-xl backdrop-blur-md border border-slate-700">
            <span className="text-lg font-bold text-slate-100">Vote to reveal results</span>
          </div>
        </div>
      )}

      {/* Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isRevealed && !isLoading ? 1 : 0.3, y: 0 }}
        className="mt-8 text-center"
      >
        <div className="text-5xl font-black text-slate-100">
          {isLoading ? '...' : isRevealed ? `${Math.round(percentage)}%` : '??%'}
        </div>
        <p className="mt-2 text-slate-300 font-medium">
          {isLoading ? 'Loading results...' : 'of developers say AI replaced them'}
        </p>
        <div className="mt-4 inline-block rounded-full bg-slate-700 px-4 py-1.5 text-sm font-semibold text-slate-300">
          {isLoading ? '...' : `${displayedTotal.toLocaleString()} total votes`}
        </div>
      </motion.div>
    </div>
  )
}
