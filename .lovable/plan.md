
## Plano de Correções do Painel Administrativo

Identifiquei os 3 problemas relatados e vou corrigi-los:

---

### Problema 1: Link do YouTube na Pagina Inicial

**Diagnostico:**
A pagina de Configuracoes (`SettingsAdmin.tsx`) existe e funciona corretamente - os dados estao no banco (`youtube_video_id: CyKl-0Y1ZDg`, `youtube_channel_url: https://youtube.com/@example`). O componente `YouTubeEmbed.tsx` tambem busca esses dados corretamente.

**Problema identificado:**
O menu do admin pode nao estar mostrando o link para a pagina de Configuracoes, ou o usuario nao esta encontrando onde alterar.

**Solucao:**
- Verificar se a rota `/admin/configuracoes` esta corretamente configurada no App.tsx e no menu lateral
- Garantir que o item "Configuracoes" aparece no menu do AdminLayout

---

### Problema 2: Banners Duplicados

**Diagnostico:**
Os banners no banco estao corretos - ambos tem `position: above_news` (slot 1 e slot 2). O problema e que na pagina Index.tsx, o componente `AdBanner` e usado DUAS vezes sem especificar a posicao correta:

```tsx
{/* Ad Banners - Above Latest News */}
<AdBanner />  {/* Usa position="above_news" por padrao */}

{/* Ad Banners - Above Communicators */}
<AdBanner />  {/* Tambem usa position="above_news" por padrao! */}
```

Ambos estao usando a mesma posicao padrao, causando a duplicacao visual.

**Solucao:**
- Corrigir o Index.tsx para passar a prop `position` correta:
  - Primeiro AdBanner: `position="above_news"`
  - Segundo AdBanner: `position="above_communicators"`

---

### Problema 3: Radios nao Sincronizando entre Paginas

**Diagnostico:**
O componente `RadioPlayer.tsx` usa dados estaticos do arquivo `src/data/radios.ts` (dados hardcoded), enquanto a pagina "Nossas Radios" (`Radios.tsx`) e o `RadiosAdmin.tsx` usam dados dinamicos do banco de dados via `useRadios()`.

**Problema:** O player de radio na pagina inicial ignora completamente o banco de dados.

**Solucao:**
- Modificar o `RadioPlayerContext.tsx` para buscar radios do banco de dados
- Atualizar o `RadioPlayer.tsx` para usar radios do banco em vez do arquivo estatico
- Manter o arquivo `src/data/radios.ts` como fallback caso o banco falhe

---

### Arquivos a Modificar

1. **`src/pages/Index.tsx`**
   - Corrigir as props `position` dos componentes AdBanner

2. **`src/contexts/RadioPlayerContext.tsx`**
   - Adicionar query para buscar radios do banco de dados
   - Usar radios dinamicos em vez de estaticos

3. **`src/components/home/RadioPlayer.tsx`**
   - Usar radios do contexto (que agora virao do banco)
   - Remover import do arquivo estatico

4. **`src/components/admin/AdminLayout.tsx`** (verificar)
   - Confirmar que o item Configuracoes esta no menu

5. **`src/App.tsx`** (verificar)
   - Confirmar que a rota `/admin/configuracoes` existe

---

### Resumo das Correcoes

| Problema | Causa | Solucao |
|----------|-------|---------|
| YouTube nao editavel | Menu/rota pode estar faltando | Verificar e corrigir navegacao |
| Banners duplicados | Prop `position` nao passada | Passar posicoes diferentes |
| Radios nao sincronizam | Player usa arquivo estatico | Integrar com banco de dados |
