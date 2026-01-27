'use client'

import { motion } from 'framer-motion'

export function BarometerLoading() {
  return (
    <div className="relative flex flex-col items-center">
      {/* SVG Gauge */}
      <svg viewBox="0 0 200 120" className="w-full max-w-[400px]">
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#334155"
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

        {/* Animated Swinging Needle */}
        <motion.g
          animate={{ 
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
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
            opacity={0.6}
          />
          <circle cx="100" cy="100" r="5" fill="#f1f5f9" opacity={0.6} />
        </motion.g>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex justify-between px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span className="text-green-400">Working</span>
        <span className="text-yellow-400">Caution</span>
        <span className="text-red-400">AI Replaced</span>
      </div>

      {/* Loading Statistics */}
      <div className="mt-8 text-center">
        <div className="text-5xl font-black text-slate-100">
          ...
        </div>
        <p className="mt-2 text-slate-300 font-medium">
          Loading results...
        </p>
        <div className="mt-4 inline-block rounded-full bg-slate-700 px-4 py-1.5 text-sm font-semibold text-slate-300">
          ...
        </div>
      </div>
    </div>
  )
}
