

## Plano de Implementacao: Melhorias no Portal de Radios e Noticias

Este plano aborda 5 problemas identificados no sistema.

---

### 1. Ordem Especifica das Radios na Pagina Inicial

**Problema:**
As radios aparecem ordenadas por nome (`ORDER BY name`), mas voce quer uma ordem especifica:
1. Irece Lider FM
2. Clube FM Jacobina (91,7)
3. Lider FM Itaberaba
4. Serrana FM
5. Clube FM Joao Dourado (96,5)
6. Lider FM Ruy Barbosa

**Solucao:**
- Adicionar coluna `display_order` na tabela `radios` (migration)
- Atualizar a ordem de cada radio no banco de dados
- Modificar queries para ordenar por `display_order` em vez de `name`

**Arquivos afetados:**
- `src/contexts/RadioPlayerContext.tsx` - Ordenar por display_order
- `src/hooks/useData.ts` - Ordenar por display_order
- `src/pages/admin/RadiosAdmin.tsx` - Adicionar campo para editar ordem

---

### 2. Opcao de Ordem no Painel Admin

**Problema:**
Nao existe campo para definir a ordem de exibicao das radios.

**Solucao:**
- Adicionar campo "Ordem de Exibicao" no formulario de edicao de radios
- Exibir a ordem atual na tabela de listagem
- Permitir reordenacao

**Arquivos afetados:**
- `src/pages/admin/RadiosAdmin.tsx`

---

### 3. Numero de WhatsApp Nao Funciona na Pagina Radios

**Problema:**
Quando clica no numero da radio na pagina `/radios`, nao abre o WhatsApp.

**Analise:**
O codigo atual em `Radios.tsx` formata o numero corretamente (`https://wa.me/NUMERO`), porem:
- Pode haver espacos ou caracteres especiais no numero cadastrado
- O link esta sendo gerado mas pode haver problema no formato salvo no banco

**Solucao:**
- Verificar e limpar melhor o formato do numero (remover espacos extras)
- Garantir que o link `tel:` tambem funcione para ligacoes
- Adicionar fallback visual se numero estiver invalido

**Arquivos afetados:**
- `src/pages/Radios.tsx`

---

### 4. Comunicador Adicionado Nao Aparece na Home

**Problema:**
Voce adicionou um comunicador no admin, mas ele nao aparece na pagina inicial.

**Analise:**
Verifiquei o banco e encontrei 7 comunicadores ativos (incluindo J. Sidney com display_order 0). O componente `CommunicatorsPreview.tsx` busca dados via `useCommunicators()` que filtra `active = true`.

**Possiveis causas:**
1. Cache do React Query nao foi invalidado apos insercao
2. O comunicador foi adicionado mas `active` esta `false`
3. O comunicador nao tem `radio_id` vinculado

**Solucao:**
- Adicionar invalidacao de cache no `CommunicatorsAdmin.tsx` apos criar/editar
- Verificar se o hook `useCommunicators` esta sendo usado corretamente
- Confirmar que o React Query key esta correto

**Arquivos afetados:**
- `src/pages/admin/CommunicatorsAdmin.tsx` - Invalidar cache
- `src/components/home/CommunicatorsPreview.tsx` - Verificar key da query

---

### 5. Noticias por Regiao com Destaque Unico

**Problema:**
A secao de noticias regionais (`RegionalNews.tsx`) usa dados estaticos `mockNews` em vez do banco de dados. Alem disso:
- Nao existe logica de "destaque por regiao" (1 por regiao)
- Quando marca uma nova noticia como destaque, nao desmarca a anterior da mesma regiao

**Solucao Completa:**

#### 5.1 - Criar Hook para Noticias por Regiao com Destaque
```typescript
// Busca a noticia em destaque de cada regiao
export function useFeaturedNewsByRegion() {
  return useQuery({
    queryKey: ["news", "featured-by-region"],
    queryFn: async () => {
      const { data: regions } = await supabase
        .from("regions")
        .select("id, name, slug, color");
      
      // Para cada regiao, buscar a noticia em destaque mais recente
      const results = await Promise.all(
        regions.map(async (region) => {
          const { data } = await supabase
            .from("news")
            .select("*")
            .eq("region_id", region.id)
            .eq("status", "published")
            .eq("featured", true)
            .order("published_at", { ascending: false })
            .limit(1);
          
          return { region, featuredNews: data?.[0] || null };
        })
      );
      
      return results;
    },
  });
}
```

#### 5.2 - Logica de Destaque Exclusivo por Regiao
Quando marcar uma noticia como destaque:
1. Verificar a regiao da noticia
2. Remover destaque de todas as noticias dessa regiao
3. Marcar a nova noticia como destaque

**Implementacao no NewsForm.tsx:**
```typescript
// Antes de salvar, se featured = true
if (formData.featured && formData.region_id) {
  // Desmarcar destaque das outras noticias da mesma regiao
  await supabase
    .from("news")
    .update({ featured: false })
    .eq("region_id", formData.region_id)
    .eq("featured", true)
    .neq("id", id); // exceto a propria noticia
}
```

#### 5.3 - Atualizar Secao Regional na Home
Modificar `RegionalNews.tsx` para:
- Buscar dados do banco em vez de `mockNews`
- Mostrar 4 cards (1 por regiao) com a noticia em destaque
- Ao clicar, ir para `/noticias?regiao=ID` com destaque no topo

**Arquivos afetados:**
- `src/hooks/useData.ts` - Novo hook `useFeaturedNewsByRegion`
- `src/components/home/RegionalNews.tsx` - Usar dados dinamicos
- `src/pages/admin/NewsForm.tsx` - Logica de destaque exclusivo
- `src/pages/Noticias.tsx` - Mostrar destaque no topo da listagem

---

### Migracao do Banco de Dados

Adicionar coluna `display_order` na tabela `radios`:

```sql
-- Adicionar coluna display_order
ALTER TABLE radios ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Definir ordem inicial conforme solicitado
UPDATE radios SET display_order = 1 WHERE name ILIKE '%Irece%Lider%';
UPDATE radios SET display_order = 2 WHERE name ILIKE '%Clube%Jacobina%';
UPDATE radios SET display_order = 3 WHERE name ILIKE '%Lider%Itaberaba%';
UPDATE radios SET display_order = 4 WHERE name ILIKE '%Serrana%';
UPDATE radios SET display_order = 5 WHERE name ILIKE '%Clube%Joao%';
UPDATE radios SET display_order = 6 WHERE name ILIKE '%Lider%Ruy%';
```

---

### Resumo das Alteracoes

| Problema | Arquivo | Alteracao |
|----------|---------|-----------|
| Ordem radios | DB + RadioPlayerContext + useData | Adicionar e usar `display_order` |
| Admin ordem radios | RadiosAdmin.tsx | Campo "Ordem de Exibicao" |
| WhatsApp nao funciona | Radios.tsx | Melhorar limpeza do numero |
| Comunicador nao aparece | CommunicatorsAdmin.tsx | Invalidar cache corretamente |
| Noticias regionais | RegionalNews.tsx + NewsForm.tsx + useData.ts | Destaque unico por regiao |

---

### Detalhes Tecnicos

**Ordem das Radios:**
A coluna `display_order` sera um numero inteiro onde menor = aparece primeiro. No admin, voce podera definir qual numero cada radio deve ter (1, 2, 3...).

**Destaque por Regiao:**
O campo `featured` na tabela `news` sera controlado automaticamente - quando voce marcar uma noticia como destaque, o sistema desmarca automaticamente qualquer outra da mesma regiao que estava marcada antes.

**Cache do React Query:**
Os dados sao cacheados para performance. Quando adiciona um comunicador no admin, precisa invalidar o cache para que a home carregue os novos dados. Isso sera corrigido adicionando `queryClient.invalidateQueries({ queryKey: ["communicators"] })` apos salvar.

