import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const specialty = searchParams.get('specialty')
  const period = searchParams.get('period') // e.g., '7d', '30d', 'all'

  const supabase = await createClient()
  
  let query = supabase.from('votes').select('vote_type', { count: 'exact' })

  if (specialty && specialty !== 'all') {
    query = query.eq('specialty', specialty)
  }

  if (period && period !== 'all') {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 0
    if (days > 0) {
      const date = new Date()
      date.setDate(date.getDate() - days)
      query = query.gte('created_at', date.toISOString())
    }
  }

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const workingCount = data?.filter(v => v.vote_type === 'working').length || 0
  const aiReplacedCount = data?.filter(v => v.vote_type === 'ai_replaced').length || 0
  const totalVotes = count || 0
  const percentage = totalVotes > 0 ? (aiReplacedCount / totalVotes) * 100 : 0

  return NextResponse.json({
    totalVotes,
    workingCount,
    aiReplacedCount,
    percentage
  })
}
