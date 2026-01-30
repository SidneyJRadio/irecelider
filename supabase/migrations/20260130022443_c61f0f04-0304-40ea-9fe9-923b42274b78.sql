-- Adicionar coluna whatsapp na tabela communicators
ALTER TABLE public.communicators ADD COLUMN IF NOT EXISTS whatsapp TEXT;