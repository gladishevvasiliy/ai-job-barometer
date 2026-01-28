'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VoteType, Specialty } from '@/types'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  voteType: VoteType
  specialty: Specialty
}

const viralTextsWorking = [
  "Still writing code in 2026. The machines work FOR me, not instead of me. 🟢",
  "Plot twist: I'm the one training the AI. Job security level: Tony Stark. 🦾",
  "They said AI would replace devs by 2025. My Git commits disagree. 💚",
  "I asked ChatGPT to replace me. It said 'skill issue'. 😎",
  "Neo took the green pill. Still employed. 🟢",
]

const viralTextsReplaced = [
  "I, for one, welcome our new AI overlords. 🤖 They type faster anyway.",
  "Winter came for my job. The AI sends its regards. ❄️🔴",
  "I took the red pill... and woke up to a rejection email. Matrix was right.",
  "My code review is now just Copilot talking to itself. I'm the third wheel. 🔴",
  "Hasta la vista, salary. I'll be back... maybe. 🤖",
]

export function ShareModal({ isOpen, onClose, voteType, specialty }: ShareModalProps) {
  const texts = voteType === 'working' ? viralTextsWorking : viralTextsReplaced
  const randomText = texts[Math.floor(Math.random() * texts.length)]
  
  const handleShare = () => {
    const url = window.location.origin
    const text = `${randomText}\n\nCheck the AI Job Barometer for ${specialty} devs:`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    )
  }

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                voteType === 'working' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {voteType === 'working' ? '🟢' : '🔴'}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-100">Vote Recorded!</h2>
              <p className="mt-2 text-slate-300">
                Thanks for sharing your status. Now help us reach more developers!
              </p>
            </div>

            <div className="mt-8">
              <Button
                variant="secondary"
                size="lg"
                className="h-14 w-full px-8 text-xl font-bold rounded-full shadow-lg shadow-slate-900/50 hover:shadow-slate-800/40 transition-shadow inline-flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
                onClick={handleShare}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full text-slate-400 hover:text-slate-200"
                onClick={onClose}
              >
                Maybe later
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
