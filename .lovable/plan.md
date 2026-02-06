
# Miniatura e Titulo ao Compartilhar Noticias nas Redes Sociais

## O Problema

Quando voce compartilha o link de uma noticia no WhatsApp, Facebook ou outras redes sociais, eles mostram apenas informacoes genericas ("Lovable App") porque os robos dessas plataformas nao executam JavaScript -- eles so leem o HTML estatico da pagina, que hoje tem as mesmas meta tags para todas as paginas.

## A Solucao

Criar uma funcao backend que, quando um robo de rede social acessa o link da noticia, retorna uma pagina HTML com as informacoes corretas (titulo, descricao e imagem). Para usuarios normais, a pagina continua funcionando normalmente.

### Como vai funcionar:

1. Ao compartilhar uma noticia, o link usado sera algo como:
   `https://irecelider.lovable.app/api/noticias/slug-da-noticia`

2. Quando o WhatsApp/Facebook acessar esse link, vai receber uma pagina com as meta tags corretas (titulo, imagem, descricao)

3. Essa pagina automaticamente redireciona o usuario para a noticia real no site

4. Na pagina da noticia, sera adicionado um botao de "Compartilhar" que ja copia o link correto

---

## Detalhes Tecnicos

### 1. Backend Function: `og-news`

Criar uma Edge Function em `supabase/functions/og-news/index.ts` que:

- Recebe o slug da noticia como parametro na URL (query param `slug`)
- Busca os dados da noticia no banco de dados (titulo, imagem, resumo)
- Retorna um HTML com as meta tags Open Graph corretas:
  - `og:title` -- titulo da noticia
  - `og:description` -- resumo da noticia
  - `og:image` -- imagem da noticia
  - `og:url` -- URL da noticia no site
  - `og:type` -- "article"
  - Tags do Twitter Card equivalentes
- Inclui um redirecionamento automatico via `<meta http-equiv="refresh">` e JavaScript para a URL real da noticia no site publicado

### 2. Pagina de Detalhe da Noticia (`src/pages/NoticiaDetalhe.tsx`)

- Atualizar dinamicamente o `document.title` com o titulo da noticia
- Atualizar as meta tags OG no `<head>` via JavaScript (funciona para crawlers que executam JS)
- Adicionar botoes de compartilhamento (WhatsApp, copiar link) que usam a URL da Edge Function como link de compartilhamento

### 3. Formato da URL de compartilhamento

A URL de compartilhamento sera montada assim:

```
https://{SUPABASE_URL}/functions/v1/og-news?slug={slug-da-noticia}
```

Essa URL sera usada nos botoes de compartilhar. Quando o WhatsApp acessar esse link, recebera o HTML com as meta tags corretas e o usuario sera redirecionado para a noticia real.

### Arquivos a serem criados/editados:

| Arquivo | Acao |
|---------|------|
| `supabase/functions/og-news/index.ts` | Criar - Edge Function que serve OG tags |
| `src/pages/NoticiaDetalhe.tsx` | Editar - Adicionar botoes de compartilhamento e meta tags dinamicas |

### Fluxo de compartilhamento:

```text
Usuario clica "Compartilhar no WhatsApp"
        |
        v
Link copiado: .../functions/v1/og-news?slug=minha-noticia
        |
        v
WhatsApp acessa o link (robo)
        |
        v
Edge Function busca dados no banco
        |
        v
Retorna HTML com og:title, og:image, og:description
        |
        v
WhatsApp exibe miniatura com imagem e titulo
        |
        v
Usuario clica no link no WhatsApp
        |
        v
Redirecionado para irecelider.lovable.app/noticias/minha-noticia
```
