-- Сид: 1000 голосов (55 «AI заменил», 945 «работаю»).
-- Запускать после миграции 00002_seed_votes.sql.
-- Удалить сид позже: DELETE FROM seed_votes;

-- 55 голосов «AI Got My Job»
INSERT INTO public.seed_votes (vote_type, specialty, created_at)
SELECT
  'ai_replaced'::vote_type,
  (ARRAY['frontend','backend','qa','devops','mobile','data_science','ml_engineer','designer','pm'])[1 + floor(random() * 9)::int]::specialty,
  now() - random() * interval '30 days'
FROM generate_series(1, 55);

-- 945 голосов «I'm Working»
INSERT INTO public.seed_votes (vote_type, specialty, created_at)
SELECT
  'working'::vote_type,
  (ARRAY['frontend','backend','qa','devops','mobile','data_science','ml_engineer','designer','pm'])[1 + floor(random() * 9)::int]::specialty,
  now() - random() * interval '30 days'
FROM generate_series(1, 945);
