

# Corrigir Miniatura no WhatsApp - Deploy da Funcao Backend

## Problema Encontrado

A funcao backend `og-news` **nao foi implantada (deployed)** no servidor. Quando o WhatsApp tenta acessar a URL de compartilhamento, recebe um erro **404 (Not Found)** -- por isso nao consegue ler as meta tags da noticia e nao exibe a miniatura.

O codigo da funcao ja existe e esta correto, mas precisa ser reimplantado com uma pequena atualizacao para garantir compatibilidade.

## O Que Sera Feito

1. **Atualizar a funcao backend `og-news`** para usar o formato moderno do Deno (sem o `serve()` antigo), garantindo compatibilidade com o ambiente de execucao atual.

2. **Fazer o deploy automatico** da funcao para que ela esteja disponivel online.

3. **Ajustar os headers CORS** para incluir todos os headers necessarios.

Nenhuma mudanca visual sera feita no site. Os botoes de compartilhar ja estao funcionando -- o problema era apenas que a funcao backend nao estava no ar.

## Resultado Esperado

Apos a correcao:
- Ao compartilhar uma noticia no WhatsApp, a miniatura com a imagem e o titulo da noticia vao aparecer corretamente.
- O link vai redirecionar o usuario para a pagina da noticia no site.

---

## Detalhes Tecnicos

### Arquivo a ser editado:

| Arquivo | Acao |
|---------|------|
| `supabase/functions/og-news/index.ts` | Atualizar para formato moderno do Deno |

### Mudancas no codigo:

- Substituir `import { serve } from "https://deno.land/std@0.168.0/http/server.ts"` pelo formato moderno `Deno.serve()`
- Atualizar os CORS headers para incluir todos os headers necessarios pelo sistema
- Manter toda a logica de busca de noticias e geracao de HTML com meta tags OG intacta
- O deploy sera feito automaticamente apos a edicao

