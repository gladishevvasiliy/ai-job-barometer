import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { VoteType, Specialty } from '@/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ vote: null })
  }

  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vote: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { vote_type, specialty } = await request.json() as { vote_type: VoteType, specialty: Specialty }

  // Check if vote already exists
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (existingVote) {
    // Check 30 days cooldown for update
    const lastUpdate = new Date(existingVote.updated_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (lastUpdate > thirtyDaysAgo) {
      return NextResponse.json({ 
        error: 'Cooldown', 
        message: 'You can only change your vote once every 30 days.' 
      }, { status: 429 })
    }

    const { data, error } = await supabase
      .from('votes')
      .update({ vote_type, specialty, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ vote: data })
  } else {
    // Insert new vote
    const { data, error } = await supabase
      .from('votes')
      .insert({ user_id: user.id, vote_type, specialty })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ vote: data })
  }
}
