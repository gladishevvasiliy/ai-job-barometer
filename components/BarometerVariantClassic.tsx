'use client'

import { useEffect, useRef, useState } from 'react'
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

function animatePercent(
  from: number,
  to: number,
  durationMs: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
) {
  const start = performance.now()
  const run = (now: number) => {
    const elapsed = now - start
    const t = Math.min(1, elapsed / durationMs)
    const eased = 1 - (1 - t) ** 2
    onUpdate(from + (to - from) * eased)
    if (t < 1) {
      requestAnimationFrame(run)
    } else {
      onComplete?.()
    }
  }
  requestAnimationFrame(run)
}

const IDLE_MIN = 0.22
const IDLE_MAX = 0.78

export function BarometerVariantClassic({ percentage, isRevealed, totalVotes, workingCount, aiReplacedCount, isLoading }: BarometerVariantProps) {
  const clamped = Math.max(0, Math.min(100, percentage))
  const gaugePercent = clamped / 100

  const [displayedTotal, setDisplayedTotal] = useState(0)
  const [displayedWorking, setDisplayedWorking] = useState(0)
  const [displayedReplaced, setDisplayedReplaced] = useState(0)
  const [swayPercent, setSwayPercent] = useState(0.5)
  const swayRef = useRef(0.5)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef(true)

  // Random needle positions when blurred (before vote)
  useEffect(() => {
    if (isRevealed || isLoading) return
    activeRef.current = true
    swayRef.current = swayPercent

    const scheduleNext = () => {
      if (!activeRef.current) return
      const delay = 800 + Math.random() * 1400
      timeoutRef.current = setTimeout(() => {
        if (!activeRef.current) return
        const target = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN)
        const duration = 350 + Math.random() * 400
        animatePercent(
          swayRef.current,
          target,
          duration,
          (v) => {
            if (!activeRef.current) return
            setSwayPercent(v)
            swayRef.current = v
          },
          scheduleNext
        )
      }, delay)
    }

    scheduleNext()
    return () => {
      activeRef.current = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRevealed, isLoading])

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
        {/* Gauge Chart — fixed height so layout doesn't jump when numbers animate */}
        <div className="w-full max-w-[400px] flex items-start justify-center">
          <GaugeChart
            id="ai-job-barometer-gauge"
            nrOfLevels={3}
            arcsLength={[1 / 3, 1 / 3, 1 / 3]}
            colors={['#22c55e', '#eab308', '#ef4444']}
            arcWidth={0.3}
            percent={isLoading ? 0.5 : isRevealed ? gaugePercent : swayPercent}
            hideText
            needleColor="#e5e7eb"
            needleBaseColor="#e5e7eb"
            animate={isRevealed && !isLoading}
          />
        </div>

        {/* Legend — tabular-nums and min-width so numbers don't shift layout when animating */}
        <div className="mt-4 flex justify-between items-center min-h-[20px] gap-3 px-2 sm:px-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 w-full">
          <span className="text-green-400 whitespace-nowrap shrink-0">
            Working <span className="tabular-nums inline-block min-w-[6ch] text-right">{isLoading ? '…' : isRevealed ? displayedWorking.toLocaleString() : '—'}</span>
          </span>
          <span className="text-red-400 whitespace-nowrap shrink-0">
            AI Replaced <span className="tabular-nums inline-block min-w-[6ch] text-right">{isLoading ? '…' : isRevealed ? displayedReplaced.toLocaleString() : '—'}</span>
          </span>
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

      {/* Statistics — tabular-nums so digits don't shift layout when animating */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isRevealed && !isLoading ? 1 : 0.3, y: 0 }}
        className="mt-8 text-center"
      >
        <div className="text-5xl font-black text-slate-100 tabular-nums">
          {isLoading ? '...' : isRevealed ? `${Math.round(percentage)}%` : 'X%'}
        </div>
        <p className="mt-2 text-slate-300 font-medium">
          {isLoading ? 'Loading results...' : 'of developers say AI replaced them'}
        </p>
        <div className="mt-4 inline-block rounded-full bg-slate-700 px-4 py-1.5 text-sm font-semibold text-slate-300 tabular-nums min-w-[8rem] text-center">
          {isLoading ? '...' : `${displayedTotal.toLocaleString()} total votes`}
        </div>
      </motion.div>
    </div>
  )
}
