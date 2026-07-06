-- Tabela de Configurações de Precificação
create table if not exists public.configuracoes_precos (
  chave text primary key,
  valor numeric not null,
  descricao text,
  atualizado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.configuracoes_precos enable row level security;

-- Qualquer pessoa pode ler os preços (para a calculadora no site público)
create policy "Preços são visíveis publicamente"
on public.configuracoes_precos for select
to public
using ( true );

-- Somente usuários logados podem atualizar
create policy "Somente autenticados podem editar preços"
on public.configuracoes_precos for update
to authenticated
using ( true );

-- Inserir os preços padrões (caso não existam)
insert into public.configuracoes_precos (chave, valor, descricao) values
  ('drywall.simples', 135, 'Divisória simples (parede única) por m²'),
  ('drywall.dupla', 200, 'Parede dupla (insonorização) por m²'),
  ('drywall.forro', 115, 'Forro de drywall por m²'),
  ('eletrica.residencial', 90, 'Ponto elétrico residencial'),
  ('eletrica.comercial', 115, 'Ponto elétrico comercial'),
  ('eletrica.ac_unit', 400, 'Circuito dedicado AC/alta carga'),
  ('steel.1', 875, 'Steel Frame — 1 pavimento por m²'),
  ('steel.2', 1025, 'Steel Frame — 2 pavimentos por m²'),
  ('steel.3', 1200, 'Steel Frame — 3+ pavimentos por m²'),
  ('steel.vedacao', 350, 'Vedação em Drywall por m²'),
  ('desconto_combo', 0.15, 'Desconto percentual em projetos combinados (Ex: 0.15 = 15%)')
on conflict (chave) do nothing;
