'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Barometer } from '@/components/Barometer'
import { Button } from '@/components/ui/Button'
import { AuthModal } from '@/components/AuthModal'
import { SpecialtyModal } from '@/components/SpecialtyModal'
import { ShareModal } from '@/components/ShareModal'
import { Filters } from '@/components/Filters'
import { Specialty, VoteType, Stats, Vote } from '@/types'
import { initPostHog, captureEvent } from '@/lib/posthog'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [userVote, setUserVote] = useState<Vote | null>(null)
  const [stats, setStats] = useState<Stats>({ totalVotes: 0, workingCount: 0, aiReplacedCount: 0, percentage: 0 })
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'all'>('all')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  
  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  
  // Pending vote action
  const [pendingVote, setPendingVote] = useState<VoteType | null>(null)

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

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchStats()
  }, [selectedSpecialty, selectedPeriod])

  const fetchStats = async () => {
    const res = await fetch(`/api/stats?specialty=${selectedSpecialty}&period=${selectedPeriod}`)
    const data = await res.json()
    if (!data.error) setStats(data)
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
      setIsShareModalOpen(true)
      captureEvent('vote_cast', { type: pendingVote, specialty })
    } catch (error) {
      console.error('Failed to cast vote:', error)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            AI Job Barometer
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-600">
            Real-time sentiment tracker for developers. 
            Are we thriving or being replaced?
          </p>
        </div>

        {/* Barometer Section */}
        <div className="mt-16 rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <Barometer 
            percentage={stats.percentage} 
            isRevealed={!!userVote} 
            totalVotes={stats.totalVotes}
          />

          <div className="mt-12 flex flex-col items-center gap-6">
            {!userVote ? (
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="h-16 px-8 text-xl font-bold shadow-lg shadow-green-200"
                  onClick={() => handleVoteClick('working')}
                >
                  🟢 I&apos;m Working
                </Button>
                <Button 
                  variant="danger" 
                  size="lg" 
                  className="h-16 px-8 text-xl font-bold shadow-lg shadow-red-200"
                  onClick={() => handleVoteClick('ai_replaced')}
                >
                  🔴 AI Got My Job
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-medium text-slate-700">
                  You voted: <span className={userVote.vote_type === 'working' ? 'text-green-600' : 'text-red-600 font-bold'}>
                    {userVote.vote_type === 'working' ? "I'm Working" : "AI Got My Job"}
                  </span>
                </p>
                <Button 
                  variant="ghost" 
                  className="mt-2 text-slate-400"
                  onClick={() => handleVoteClick(userVote.vote_type)}
                >
                  Change vote
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8">
          <Filters 
            specialty={selectedSpecialty}
            period={selectedPeriod}
            onSpecialtyChange={setSelectedSpecialty}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
          <p>© 2026 AI Job Barometer. Built for the community.</p>
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
          onClose={() => setIsShareModalOpen(false)} 
          voteType={userVote.vote_type}
          specialty={userVote.specialty}
        />
      )}
    </main>
  )
}
