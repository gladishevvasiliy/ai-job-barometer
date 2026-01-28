import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const specialty = searchParams.get('specialty')
  const period = searchParams.get('period') // e.g., '7d', '30d', 'all'

  const supabase = await createClient()

  let votesQuery = supabase.from('votes').select('vote_type', { count: 'exact' })
  let seedQuery = supabase.from('seed_votes').select('vote_type', { count: 'exact' })

  if (specialty && specialty !== 'all') {
    votesQuery = votesQuery.eq('specialty', specialty)
    seedQuery = seedQuery.eq('specialty', specialty)
  }
  if (period && period !== 'all') {
    const days = period === '3m' ? 90 : period === '6m' ? 180 : period === '1y' ? 365 : 0
    if (days > 0) {
      const date = new Date()
      date.setDate(date.getDate() - days)
      const iso = date.toISOString()
      votesQuery = votesQuery.gte('created_at', iso)
      seedQuery = seedQuery.gte('created_at', iso)
    }
  }

  const [votesRes, seedRes] = await Promise.all([votesQuery, seedQuery])

  if (votesRes.error) {
    return NextResponse.json({ error: votesRes.error.message }, { status: 500 })
  }
  if (seedRes.error) {
    return NextResponse.json({ error: seedRes.error.message }, { status: 500 })
  }

  const votesData = votesRes.data ?? []
  const seedData = seedRes.data ?? []
  const workingCount =
    votesData.filter(v => v.vote_type === 'working').length +
    seedData.filter(v => v.vote_type === 'working').length
  const aiReplacedCount =
    votesData.filter(v => v.vote_type === 'ai_replaced').length +
    seedData.filter(v => v.vote_type === 'ai_replaced').length
  const totalVotes = (votesRes.count ?? 0) + (seedRes.count ?? 0)
  const percentage = totalVotes > 0 ? (aiReplacedCount / totalVotes) * 100 : 0

  return NextResponse.json({
    totalVotes,
    workingCount,
    aiReplacedCount,
    percentage
  })
}
