
# Corrigir URL de Compartilhamento das Noticias

## Problema

O botao "Copiar link" e o compartilhamento no WhatsApp estao usando a URL da funcao backend (algo como `https://csrxmtlctewvctmfyuur.supabase.co/functions/v1/og-news?slug=...`), que e uma URL estranha e confusa para o usuario. Alem disso, a funcao backend esta redirecionando para `irecelider.lovable.app` em vez do dominio correto `aliderdachapada.com.br`.

## O Que Sera Feito

### 1. Corrigir o botao "Copiar link" e WhatsApp (`src/components/news/ShareButtons.tsx`)

O link copiado e compartilhado passara a ser a URL real do site:

```
https://aliderdachapada.com.br/noticias/slug-da-noticia
```

Em vez da URL estranha da funcao backend.

Para o WhatsApp especificamente, sera usado o link da funcao backend (para que a miniatura apareca), mas o texto exibido sera limpo e amigavel. Ja o botao "Copiar link" vai copiar a URL real do site.

**Abordagem:** 
- O botao "Copiar link" vai copiar: `https://aliderdachapada.com.br/noticias/{slug}`
- O botao "WhatsApp" vai usar a URL da funcao backend (para exibir a miniatura), mas isso fica transparente para o usuario
- O botao "Mais" (compartilhamento nativo) vai usar a URL real do site

### 2. Atualizar o dominio na funcao backend (`supabase/functions/og-news/index.ts`)

A constante `SITE_URL` sera alterada de `https://irecelider.lovable.app` para `https://aliderdachapada.com.br`, para que:
- O redirecionamento apos o WhatsApp ler as meta tags leve ao dominio correto
- As meta tags `og:url` e `canonical` apontem para o dominio correto

## Resultado Esperado

- Botao "Copiar link": copia `https://aliderdachapada.com.br/noticias/minha-noticia`
- Botao "WhatsApp": compartilha com miniatura e redireciona para o dominio correto
- Botao "Mais": compartilha a URL real do site

---

## Detalhes Tecnicos

### Arquivos a serem editados:

| Arquivo | Mudanca |
|---------|---------|
| `src/components/news/ShareButtons.tsx` | Alterar `getShareUrl()` para usar `https://aliderdachapada.com.br/noticias/{slug}` no "Copiar link" e share nativo. Manter URL da funcao backend apenas para o WhatsApp (para miniatura funcionar) |
| `supabase/functions/og-news/index.ts` | Alterar `SITE_URL` de `https://irecelider.lovable.app` para `https://aliderdachapada.com.br` |

### Mudancas em `ShareButtons.tsx`:
- Criar duas URLs: `siteUrl` (URL real do site para copiar) e `ogUrl` (URL da funcao backend para WhatsApp)
- `handleCopyLink` usara `siteUrl`
- `handleWhatsApp` usara `ogUrl` (para a miniatura aparecer)
- `handleNativeShare` usara `siteUrl`

### Mudancas em `og-news/index.ts`:
- Linha 8: `const SITE_URL = "https://aliderdachapada.com.br";`
