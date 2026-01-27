'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export interface BarometerVariantProps {
  percentage: number // 0-100 (percentage of red votes)
  isRevealed: boolean
  totalVotes: number
}

export function BarometerVariantClassic({ percentage, isRevealed, totalVotes }: BarometerVariantProps) {
  // Map 0-100 to rotation: -75deg (green) to 75deg (red) to keep needle visually inside the gauge
  const minAngle = -75
  const maxAngle = 75
  const rotation = minAngle + (percentage / 100) * (maxAngle - minAngle)

  return (
    <div className="relative flex flex-col items-center">
      {/* Container with Blur */}
      <div className={clsx(
        "relative w-full max-w-[400px] transition-all duration-1000 ease-out",
        !isRevealed && "blur-[12px] select-none pointer-events-none"
      )}>
        {/* SVG Gauge */}
        <svg viewBox="0 0 200 120" className="w-full">
          {/* Pizza-like solid sectors with equal angles (three equal slices of the semicircle) */}
          {/* Green Zone (left third) */}
          <path
            d="M 100 100 L 20 100 A 80 80 0 0 1 60 31 Z"
            fill="#22c55e"
          />
          {/* Yellow Zone (middle third) */}
          <path
            d="M 100 100 L 60 31 A 80 80 0 0 1 140 31 Z"
            fill="#eab308"
          />
          {/* Red Zone (right third) */}
          <path
            d="M 100 100 L 140 31 A 80 80 0 0 1 180 100 Z"
            fill="#ef4444"
          />

          {/* Needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: isRevealed ? rotation : 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            style={{ originX: '100px', originY: '100px' }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke="#f1f5f9"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="5" fill="#f1f5f9" />
          </motion.g>
        </svg>

        {/* Legend */}
        <div className="mt-4 flex justify-between px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-green-400">Working</span>
          <span className="text-yellow-400">Caution</span>
          <span className="text-red-400">AI Replaced</span>
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
        animate={{ opacity: isRevealed ? 1 : 0.3, y: 0 }}
        className="mt-8 text-center"
      >
        <div className="text-5xl font-black text-slate-100">
          {isRevealed ? `${Math.round(percentage)}%` : '??%'}
        </div>
        <p className="mt-2 text-slate-300 font-medium">
          of developers say AI replaced them
        </p>
        <div className="mt-4 inline-block rounded-full bg-slate-700 px-4 py-1.5 text-sm font-semibold text-slate-300">
          {totalVotes.toLocaleString()} total votes
        </div>
      </motion.div>
    </div>
  )
}
