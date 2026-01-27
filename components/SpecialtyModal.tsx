'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Specialty } from '@/types'
import { useState } from 'react'

interface SpecialtyModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (specialty: Specialty) => void
}

const specialties: { id: Specialty; label: string }[] = [
  { id: 'frontend', label: 'Frontend Developer' },
  { id: 'backend', label: 'Backend Developer' },
  { id: 'qa', label: 'QA Engineer' },
  { id: 'devops', label: 'DevOps / SRE' },
  { id: 'mobile', label: 'Mobile Developer' },
  { id: 'data_science', label: 'Data Science' },
  { id: 'ml_engineer', label: 'ML Engineer' },
  { id: 'designer', label: 'Product Designer' },
  { id: 'pm', label: 'Product Manager' },
]

export function SpecialtyModal({ isOpen, onClose, onSelect }: SpecialtyModalProps) {
  const [selected, setSelected] = useState<Specialty | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-100">What do you do?</h2>
              <p className="mt-2 text-slate-300">
                Select your primary specialization to help us segment the data.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specialties.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => setSelected(specialty.id)}
                  className={`flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                    selected === specialty.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-700/50'
                  }`}
                >
                  <span className={`font-medium ${selected === specialty.id ? 'text-blue-300' : 'text-slate-200'}`}>
                    {specialty.label}
                  </span>
                  {selected === specialty.id && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!selected}
                onClick={() => selected && onSelect(selected)}
              >
                Confirm & Vote
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
