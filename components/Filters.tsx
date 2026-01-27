'use client'

import { Specialty } from '@/types'

interface FiltersProps {
  specialty: Specialty | 'all'
  period: string
  onSpecialtyChange: (specialty: Specialty | 'all') => void
  onPeriodChange: (period: string) => void
}

const specialties: { id: Specialty | 'all'; label: string }[] = [
  { id: 'all', label: 'All Specialties' },
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

const periods = [
  { id: 'all', label: 'All Time' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
]

export function Filters({ specialty, period, onSpecialtyChange, onPeriodChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Specialization</label>
        <select
          value={specialty}
          onChange={(e) => onSpecialtyChange(e.target.value as Specialty | 'all')}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {specialties.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-800">{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Period</label>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {periods.map((p) => (
            <option key={p.id} value={p.id} className="bg-slate-800">{p.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
