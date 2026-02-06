
# Corrigir Preview de Link no WhatsApp com Titulo, Descricao e Imagem

## O Problema

Quando voce compartilha uma noticia no WhatsApp, o preview do link (a "previa") mostra apenas informacoes genericas do site ("Irece Lider - Portal de Noticias") em vez de mostrar o **titulo da noticia**, a **descricao** e a **imagem** daquela noticia especifica.

Isso acontece porque o WhatsApp nao executa JavaScript -- ele apenas le as meta tags do HTML que o servidor retorna. Como o site e uma aplicacao de pagina unica (SPA), o servidor sempre retorna o mesmo `index.html` com as meta tags genericas do portal.

## A Solucao

Ja existe uma funcao backend (`og-news`) que foi criada exatamente para resolver isso. Ela gera uma pagina HTML com as meta tags especificas de cada noticia (titulo, descricao, imagem). O problema e que:

1. A funcao **nao esta no ar** (retorna erro 404 -- precisa ser reimplantada)
2. O botao WhatsApp **nao esta usando** essa funcao -- esta enviando a URL direta do site

### Como vai funcionar:

1. Ao clicar em **WhatsApp**, a mensagem enviada contera o **titulo da noticia** como texto + o link da funcao backend
2. O WhatsApp vai ler esse link e encontrar as meta tags com o **titulo**, **descricao** e **imagem da noticia**
3. Quando a pessoa clicar no link no WhatsApp, sera **redirecionada automaticamente** para `https://aliderdachapada.com.br/noticias/...`
4. O botao **"Copiar link"** continuara copiando a URL limpa do site: `https://aliderdachapada.com.br/noticias/slug`

### Nota importante sobre a URL no WhatsApp

Para que o WhatsApp consiga exibir o titulo, descricao e imagem da noticia, ele precisa acessar uma URL que retorne essas informacoes no HTML. A URL que aparecera na mensagem sera a da funcao backend, mas o **preview mostrara o titulo e a imagem da noticia**, e ao clicar, o usuario sera levado ao site correto.

## O Que Sera Feito

### 1. Reimplantar a funcao backend `og-news`
A funcao ja esta pronta e correta. Precisa apenas ser reimplantada (deploy) para voltar a funcionar.

### 2. Atualizar o componente `ShareButtons.tsx`
- O botao **WhatsApp** passara a usar a URL da funcao backend para que o preview mostre o titulo, descricao e imagem da noticia
- O botao **"Copiar link"** continuara usando a URL limpa do site
- O botao **"Mais"** (compartilhamento nativo) continuara usando a URL limpa do site

### 3. Passar `excerpt` e `image_url` para o componente ShareButtons
Atualmente o componente so recebe `slug` e `title`. Sera adicionado `excerpt` para que a mensagem no WhatsApp contenha tambem a descricao da noticia.

## Resultado Esperado

Ao compartilhar no WhatsApp, a pessoa vera:
- **Titulo da noticia** (no preview do link)
- **Descricao/resumo** (no preview do link)
- **Imagem da noticia** como miniatura (no preview do link)
- Ao clicar, sera redirecionada para `https://aliderdachapada.com.br/noticias/...`

---

## Detalhes Tecnicos

### Arquivos a serem editados:

| Arquivo | Mudanca |
|---------|---------|
| `src/components/news/ShareButtons.tsx` | Adicionar prop `excerpt`, usar URL da funcao backend para WhatsApp |
| `src/pages/NoticiaDetalhe.tsx` | Passar `excerpt` para o componente ShareButtons |
| `supabase/functions/og-news/index.ts` | Reimplantar (deploy) -- codigo ja esta correto |

### Mudancas em `ShareButtons.tsx`:
- Adicionar `excerpt` ao `ShareButtonsProps`
- Criar funcao `getOgUrl(slug)` que retorna a URL da funcao backend usando `VITE_SUPABASE_URL`
- `handleWhatsApp`: usar `ogUrl` para que o preview funcione
- `handleCopyLink`: manter `siteUrl` (URL limpa do dominio)
- `handleNativeShare`: manter `siteUrl`

### Mudancas em `NoticiaDetalhe.tsx`:
- Passar `excerpt={news.excerpt}` para `<ShareButtons />`

### Deploy:
- Reimplantar funcao `og-news` para resolver o erro 404
