

## Plano: Expansao do Painel Administrativo

### 1. Nova Tabela: Banners Publicitarios

Criar tabela `banners` no banco de dados com os campos:
- `id` (UUID, chave primaria)
- `title` (texto para identificacao interna)
- `image_url` (URL da imagem do banner)
- `link_url` (link de destino ao clicar)
- `position` (enum: 'above_news' | 'above_communicators')
- `slot` (numero 1 ou 2 para cada posicao)
- `active` (boolean para ocultar/exibir)
- `display_order` (ordem de exibicao)
- `created_at`, `updated_at`

RLS: Leitura publica para banners ativos, gerenciamento apenas para admins/supervisores.

### 2. Nova Tabela: Configuracoes do Site

Criar tabela `site_settings` para configuracoes globais:
- `id` (UUID)
- `key` (texto unico: 'youtube_video_id', 'youtube_channel_url')
- `value` (texto com o valor)
- `updated_at`

Isso permite alterar o video do YouTube e outras configuracoes futuras.

### 3. Adicionar Campos na Tabela News

Adicionar colunas para controle de midia:
- `video_url` (URL do video - YouTube ou upload)
- `image_position` (enum: 'top' | 'bottom', padrao 'top')
- `video_position` (enum: 'top' | 'bottom' | null)

### 4. Nova Pagina Admin: Gerenciamento de Banners

Criar `/admin/banners` com:
- Lista de todos os banners organizados por posicao
- Formulario com upload de imagem (usando ImageUpload existente)
- Campo para link de destino
- Select para posicao (acima de noticias ou comunicadores)
- Select para slot (1 ou 2)
- Toggle de ativar/desativar
- Botoes de editar e excluir

### 5. Nova Pagina Admin: Configuracoes do Site

Criar `/admin/configuracoes` com:
- Campo para URL/ID do video do YouTube principal
- Campo para URL do canal do YouTube
- Preview do video incorporado
- Botao de salvar

### 6. Atualizar Formulario de Noticias

Modificar `NewsForm.tsx` para incluir:
- Componente de upload/URL de video
- Select para posicao da imagem de capa (topo ou final)
- Select para posicao do video (topo, final ou nenhum)
- Preview das posicoes escolhidas

### 7. Atualizar Admin de Comunicadores

Modificar `CommunicatorsAdmin.tsx`:
- Adicionar toggle de ativo/inativo na tabela
- Mostrar indicador visual de status (badge verde/cinza)
- Permitir reativar comunicadores ocultos

### 8. Atualizar Admin de Radios

Modificar `RadiosAdmin.tsx`:
- Adicionar toggle de ativo/inativo na tabela
- Mostrar indicador visual de status
- Permitir reativar radios ocultas

### 9. Atualizar Componente AdBanner

Modificar `AdBanner.tsx` para:
- Buscar banners ativos do banco de dados
- Renderizar imagens reais com links
- Aceitar prop de posicao para filtrar banners

### 10. Atualizar YouTubeEmbed

Modificar `YouTubeEmbed.tsx` para:
- Buscar configuracoes do banco de dados
- Usar video_id e channel_url dinamicos

### 11. Atualizar Menu do Admin

Adicionar ao `AdminLayout.tsx`:
- Item "Banners" no menu lateral
- Item "Configuracoes" no menu lateral

### 12. Atualizar Rotas

Adicionar em `App.tsx`:
- `/admin/banners` -> BannersAdmin
- `/admin/configuracoes` -> SettingsAdmin

### Arquivos a Criar

1. `src/pages/admin/BannersAdmin.tsx` - CRUD de banners
2. `src/pages/admin/SettingsAdmin.tsx` - Configuracoes do site
3. `src/components/admin/VideoUpload.tsx` - Componente para upload/URL de video

### Arquivos a Modificar

1. `src/pages/admin/NewsForm.tsx` - Adicionar campos de video e posicao
2. `src/pages/admin/CommunicatorsAdmin.tsx` - Toggle de ativo
3. `src/pages/admin/RadiosAdmin.tsx` - Toggle de ativo
4. `src/components/admin/AdminLayout.tsx` - Novos itens no menu
5. `src/components/home/AdBanner.tsx` - Buscar dados do banco
6. `src/components/home/YouTubeEmbed.tsx` - Configuracao dinamica
7. `src/pages/NoticiaDetalhe.tsx` - Renderizar video e posicoes
8. `src/App.tsx` - Novas rotas

### Migracoes de Banco de Dados

**Migracao 1: Tabela de Banners**
```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL DEFAULT 'above_news',
  slot INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
-- Politicas RLS para banners
```

**Migracao 2: Tabela de Configuracoes**
```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO site_settings (key, value) VALUES 
  ('youtube_video_id', 'CyKl-0Y1ZDg'),
  ('youtube_channel_url', 'https://youtube.com/@example');

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
-- Politicas RLS
```

**Migracao 3: Campos de Video em News**
```sql
ALTER TABLE news 
  ADD COLUMN video_url TEXT,
  ADD COLUMN image_position TEXT DEFAULT 'top',
  ADD COLUMN video_position TEXT;
```

### Ordem de Implementacao

1. Criar migracoes de banco de dados
2. Implementar pagina de Banners (novo)
3. Implementar pagina de Configuracoes (novo)
4. Atualizar formulario de Noticias
5. Atualizar admins de Comunicadores e Radios
6. Atualizar componentes da Home (AdBanner, YouTubeEmbed)
7. Atualizar detalhe da noticia para mostrar video

