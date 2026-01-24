'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface BarometerProps {
  percentage: number // 0-100 (percentage of red votes)
  isRevealed: boolean
  totalVotes: number
}

export function Barometer({ percentage, isRevealed, totalVotes }: BarometerProps) {
  // Map 0-100 to rotation: -90deg (green) to 90deg (red)
  const rotation = (percentage / 100) * 180 - 90

  return (
    <div className="relative flex flex-col items-center">
      {/* Container with Blur */}
      <div className={clsx(
        "relative w-full max-w-[400px] transition-all duration-1000 ease-out",
        !isRevealed && "blur-[12px] select-none pointer-events-none"
      )}>
        {/* SVG Gauge */}
        <svg viewBox="0 0 200 120" className="w-full">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Color Sections */}
          {/* Green Zone (0-33%) */}
          <path
            d="M 20 100 A 80 80 0 0 1 73 38"
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
          />
          {/* Yellow Zone (33-66%) */}
          <path
            d="M 73 38 A 80 80 0 0 1 127 38"
            fill="none"
            stroke="#eab308"
            strokeWidth="12"
          />
          {/* Red Zone (66-100%) */}
          <path
            d="M 127 38 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
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
              stroke="#1e293b"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="5" fill="#1e293b" />
          </motion.g>
        </svg>

        {/* Legend */}
        <div className="mt-4 flex justify-between px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="text-green-600">Working</span>
          <span className="text-yellow-500">Caution</span>
          <span className="text-red-600">AI Replaced</span>
        </div>
      </div>

      {/* Reveal Overlay */}
      {!isRevealed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-white/90 px-6 py-3 shadow-xl backdrop-blur-md">
            <span className="text-lg font-bold text-slate-900">Vote to reveal results</span>
          </div>
        </div>
      )}

      {/* Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isRevealed ? 1 : 0.3, y: 0 }}
        className="mt-8 text-center"
      >
        <div className="text-5xl font-black text-slate-900">
          {isRevealed ? `${Math.round(percentage)}%` : '??%'}
        </div>
        <p className="mt-2 text-slate-500 font-medium">
          of developers say AI replaced them
        </p>
        <div className="mt-4 inline-block rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600">
          {totalVotes.toLocaleString()} total votes
        </div>
      </motion.div>
    </div>
  )
}
