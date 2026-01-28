# 📊 AI Job Barometer

Real-time sentiment tracker for developers. Are we thriving or being replaced by AI?

## What is this?
A simple, interactive tool for the dev community to track how AI is actually affecting our jobs. No hype, just real votes from real people.

## Features
- **The Barometer:** A visual gauge showing the "heat level" of AI replacement.
- **Curiosity-driven:** Results are blurred until you cast your vote.
- **Verified Votes:** OAuth integration with Twitter (X) and LinkedIn to ensure unique, real developers.
- **Segmented Data:** Filter results by specialization (Frontend, Backend, DevOps, etc.) and time period.
- **Viral Sharing:** Pre-written, cheeky share texts for Twitter to spread the word.

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Database & Auth:** Supabase
- **Analytics:** PostHog
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion

## Getting Started

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Supabase Setup:**
   - Create a project at [supabase.com](https://supabase.com).
   - **Миграции и сид** (Supabase CLI из корня проекта):
     ```bash
     supabase link --project-ref <your-project-ref>
     supabase db push
     supabase db execute -f scripts/seed-votes.sql
     ```
     Либо вручную в Dashboard → SQL Editor: выполнить по очереди `supabase/migrations/00001_initial_schema.sql`, `00002_seed_votes.sql`, затем (опционально) `scripts/seed-votes.sql`. Удалить сид позже: `DELETE FROM seed_votes;`
   - Enable Twitter/LinkedIn providers in Auth settings.

3. **Env Vars:**
   Create a `.env.local` based on `.env.example`.

4. **Run it:**
   ```bash
   npm run dev
   ```

## License
MIT
