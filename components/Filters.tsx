'use client'

import { useState } from 'react'
import { Specialty } from '@/types'
import { clsx } from 'clsx'

interface FiltersProps {
  specialty: Specialty | 'all'
  period: string
  onSpecialtyChange: (specialty: Specialty | 'all') => void
  onPeriodChange: (period: string) => void
  disabled?: boolean
}

const allSpecialties: { id: Specialty | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'qa', label: 'QA' },
  { id: 'devops', label: 'DevOps' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'data_science', label: 'Data Science' },
  { id: 'ml_engineer', label: 'ML Engineer' },
  { id: 'designer', label: 'Designer' },
  { id: 'pm', label: 'PM' },
]

const primarySpecialties = allSpecialties.filter((s) =>
  ['frontend', 'backend', 'qa'].includes(s.id)
)
const restSpecialties = allSpecialties.filter((s) =>
  !['frontend', 'backend', 'qa'].includes(s.id)
)

const periods = [
  { id: '3m', label: '3 months' },
  { id: '6m', label: '6 months' },
  { id: '1y', label: '1 year' },
  { id: 'all', label: 'All time' },
]

export function Filters({ specialty, period, onSpecialtyChange, onPeriodChange, disabled }: FiltersProps) {
  const [expanded, setExpanded] = useState(false)
  const tabBase = 'rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
  const tabInactive = 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
  const tabActive = 'bg-slate-600 text-slate-100'
  const tabDisabled = 'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none'
  const visibleSpecialties = expanded ? allSpecialties : primarySpecialties

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-col items-center gap-2 w-full max-w-2xl">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Specialization</span>
        <div
          className={clsx(
            'flex flex-wrap justify-center gap-2',
            disabled && 'opacity-50 pointer-events-none'
          )}
          role="tablist"
          aria-label="Specialization"
        >
          {visibleSpecialties.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={specialty === s.id}
              disabled={disabled}
              onClick={() => onSpecialtyChange(s.id)}
              className={clsx(
                tabBase,
                specialty === s.id ? tabActive : tabInactive,
                tabDisabled
              )}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setExpanded((e) => !e)}
            className={clsx(
              tabBase,
              tabInactive,
              tabDisabled
            )}
            aria-expanded={expanded}
            aria-label={expanded ? 'Show less specialties' : 'Show more specialties'}
          >
            {expanded ? '−' : '…'}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Period</span>
        <div
          className={clsx(
            'inline-flex flex-wrap justify-center gap-2',
            disabled && 'opacity-50 pointer-events-none'
          )}
          role="tablist"
          aria-label="Time period"
        >
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={period === p.id}
              disabled={disabled}
              onClick={() => onPeriodChange(p.id)}
              className={clsx(
                tabBase,
                period === p.id ? tabActive : tabInactive,
                tabDisabled
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
