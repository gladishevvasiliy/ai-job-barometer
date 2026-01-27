'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const handleSignIn = async (provider: 'twitter' | 'linkedin') => {
    setLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in:', error)
      setLoading(null)
    }
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
              <h2 className="text-2xl font-bold text-slate-100">Sign in to Vote</h2>
              <p className="mt-2 text-slate-300">
                Choose a provider to verify your identity and cast your vote.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-3 border-2 border-slate-600 hover:border-slate-500"
                onClick={() => handleSignIn('twitter')}
                disabled={!!loading}
              >
                <Twitter className="fill-[#1DA1F2] text-[#1DA1F2]" size={20} />
                {loading === 'twitter' ? 'Redirecting...' : 'Continue with Twitter'}
              </Button>

              {/* LinkedIn hidden for now */}
              {/* 
              <Button
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-3 border-2 border-slate-600 hover:border-slate-500"
                onClick={() => handleSignIn('linkedin')}
                disabled={!!loading}
              >
                <Linkedin className="fill-[#0A66C2] text-[#0A66C2]" size={20} />
                {loading === 'linkedin' ? 'Redirecting...' : 'Continue with LinkedIn'}
              </Button>
              */}
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
