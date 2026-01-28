-- Таблица для сид-голосов (фейковые данные для демо).
-- Когда появятся реальные голоса, их можно удалить: DELETE FROM seed_votes;
CREATE TABLE public.seed_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_type vote_type NOT NULL,
  specialty specialty NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Статистика считается по votes + seed_votes; RLS не нужен (доступ только с сервера по service role).
COMMENT ON TABLE public.seed_votes IS 'Сид-голоса для демо. Удалить при появлении достаточного числа реальных голосов.';
