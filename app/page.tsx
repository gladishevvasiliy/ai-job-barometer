'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Barometer } from '@/components/Barometer'
import { BarometerSkeleton } from '@/components/BarometerSkeleton'
import { Button } from '@/components/ui/Button'
import { AuthModal } from '@/components/AuthModal'
import { SpecialtyModal } from '@/components/SpecialtyModal'
import { ShareModal } from '@/components/ShareModal'
import { Filters } from '@/components/Filters'
import { Specialty, VoteType, Stats, Vote } from '@/types'
import { initPostHog, captureEvent } from '@/lib/posthog'
import { User } from '@supabase/supabase-js'
import { clsx } from 'clsx'

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [userVote, setUserVote] = useState<Vote | null>(null)
  const [stats, setStats] = useState<Stats>({ totalVotes: 0, workingCount: 0, aiReplacedCount: 0, percentage: 0 })
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'all'>('all')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  
  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  
  // Pending vote action
  const [pendingVote, setPendingVote] = useState<VoteType | null>(null)
  
  // Timeout ref for delayed share modal
  const shareModalTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    initPostHog()
    
    // Auth listener
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    fetchStats()
    fetchUserVote()

    return () => {
      subscription.unsubscribe()
      // Clear share modal timeout on unmount
      if (shareModalTimeoutRef.current) {
        clearTimeout(shareModalTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [selectedSpecialty, selectedPeriod])

  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const res = await fetch(`/api/stats?specialty=${selectedSpecialty}&period=${selectedPeriod}`)
      const data = await res.json()
      if (!data.error) setStats(data)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchUserVote = async () => {
    const res = await fetch('/api/votes')
    const data = await res.json()
    if (data.vote) setUserVote(data.vote)
  }

  const handleVoteClick = (type: VoteType) => {
    setPendingVote(type)
    if (!user) {
      setIsAuthModalOpen(true)
    } else {
      setIsSpecialtyModalOpen(true)
    }
  }

  const handleSpecialtySelect = async (specialty: Specialty) => {
    if (!pendingVote) return

    setIsSpecialtyModalOpen(false)
    
    // Clear any existing share modal timeout before casting a new vote
    if (shareModalTimeoutRef.current) {
      clearTimeout(shareModalTimeoutRef.current)
      shareModalTimeoutRef.current = null
    }
    
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote_type: pendingVote, specialty })
      })
      const data = await res.json()

      if (data.error) {
        if (data.error === 'Cooldown') {
          alert(data.message)
        } else {
          console.error(data.error)
        }
        return
      }

      setUserVote(data.vote)
      fetchStats()
      
      // Schedule share modal to open after 10 seconds
      shareModalTimeoutRef.current = setTimeout(() => {
        setIsShareModalOpen(true)
        shareModalTimeoutRef.current = null
      }, 10000)
      
      captureEvent('vote_cast', { type: pendingVote, specialty })
    } catch (error) {
      console.error('Failed to cast vote:', error)
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-900 px-4 py-8 md:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-100 md:text-6xl">
            AI Job Barometer
          </h1>
        </div>

        {/* Filters — наверху, disabled пока не проголосовал */}
        <div className="mt-4">
          <Filters 
            specialty={selectedSpecialty}
            period={selectedPeriod}
            onSpecialtyChange={setSelectedSpecialty}
            onPeriodChange={setSelectedPeriod}
            disabled={!userVote}
          />
        </div>

        {/* Barometer Section */}
        <div className="mt-6 rounded-3xl bg-slate-800 p-8 shadow-lg md:p-12 border border-slate-700">
          {isLoadingStats ? (
            <BarometerSkeleton />
          ) : (
            <Barometer 
              percentage={stats.percentage} 
              isRevealed={!!userVote} 
              totalVotes={stats.totalVotes}
              workingCount={stats.workingCount}
              aiReplacedCount={stats.aiReplacedCount}
              isLoading={false}
            />
          )}

          <div className="mt-8 flex flex-col items-center gap-6">
            {!userVote ? (
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="h-14 w-full sm:w-auto sm:min-w-[200px] px-8 text-xl font-bold rounded-full shadow-lg shadow-green-900/50 hover:shadow-green-800/40 transition-shadow"
                  onClick={() => handleVoteClick('working')}
                >
                  I&apos;m Working
                </Button>
                <Button 
                  variant="danger" 
                  size="lg" 
                  className="h-14 w-full sm:w-auto sm:min-w-[200px] px-8 text-xl font-bold rounded-full shadow-lg shadow-red-900/50 hover:shadow-red-800/40 transition-shadow"
                  onClick={() => handleVoteClick('ai_replaced')}
                >
                  AI Got My Job
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-medium text-slate-300">
                  You voted: <span className={userVote.vote_type === 'working' ? 'text-green-400' : 'text-red-400 font-bold'}>
                    {userVote.vote_type === 'working' ? "I'm Working" : "AI Got My Job"}
                  </span>
                </p>
                <div className="mt-4 flex flex-col items-center justify-center gap-4 w-full">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="h-14 w-full sm:w-auto sm:min-w-[200px] px-8 text-xl font-bold rounded-full shadow-lg shadow-slate-900/50 hover:shadow-slate-800/40 transition-shadow inline-flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? window.location.origin : ''
                      const text = `I voted on the AI Job Barometer — check the results for ${userVote.specialty} devs 👇`
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                        '_blank'
                      )
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="currentColor" aria-hidden>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Share on X
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-slate-400 hover:text-slate-200"
                    onClick={() => handleVoteClick(userVote.vote_type === 'working' ? 'ai_replaced' : 'working')}
                  >
                    Change vote
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
          <p>© 2026 AI Job Barometer. Built for the community.</p>
          <p className="mt-2">
            Developer:{' '}
            <a
              href="https://x.com/GladysevVasilij"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 underline underline-offset-2"
            >
              X
            </a>
            {' · '}
            <a
              href="https://www.linkedin.com/in/vasiliy-gladishev-6b85581a9/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 underline underline-offset-2"
            >
              LinkedIn
            </a>
          </p>
        </footer>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <SpecialtyModal 
        isOpen={isSpecialtyModalOpen} 
        onClose={() => setIsSpecialtyModalOpen(false)} 
        onSelect={handleSpecialtySelect}
      />
      {userVote && (
        <ShareModal 
          isOpen={isShareModalOpen} 
          onClose={() => {
            setIsShareModalOpen(false)
            // Clear timeout if user closes modal before it auto-opens
            if (shareModalTimeoutRef.current) {
              clearTimeout(shareModalTimeoutRef.current)
              shareModalTimeoutRef.current = null
            }
          }} 
          voteType={userVote.vote_type}
          specialty={userVote.specialty}
        />
      )}
    </main>
  )
}
