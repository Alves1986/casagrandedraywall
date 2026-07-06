-- ============================================================
-- SETUP STORAGE — Casa Grande Drywall
-- Executar no Supabase SQL Editor
-- ============================================================

-- 1. Criar o bucket para Portfolio (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar o bucket para Documentos/Projetos (privado)
INSERT INTO storage.buckets (id, name, public)
VALUES ('projetos', 'projetos', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas RLS para o bucket 'portfolio' (Público)
-- Permitir leitura pública
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio');

-- Permitir insert para usuários autenticados (admin/gestores)
CREATE POLICY "Auth Insert" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'portfolio' 
    AND auth.role() = 'authenticated'
);

-- Permitir update/delete para usuários autenticados
CREATE POLICY "Auth Update/Delete" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'portfolio' 
    AND auth.role() = 'authenticated'
);
CREATE POLICY "Auth Delete" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'portfolio' 
    AND auth.role() = 'authenticated'
);

-- 4. Políticas RLS para o bucket 'projetos' (Privado)
-- Apenas usuários autenticados podem ver, inserir, atualizar e deletar
CREATE POLICY "Projetos Auth Select" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'projetos' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Projetos Auth Insert" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'projetos' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Projetos Auth Update" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'projetos' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Projetos Auth Delete" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'projetos' 
    AND auth.role() = 'authenticated'
);
