

# Corrigir Compartilhamento de Noticias - URL Limpa + Preview Correto

## O Problema (3 itens encontrados)

1. **URL feia no WhatsApp**: Ao compartilhar, o texto da mensagem mostra `https://csrxmtlctewvctmfyuur.supabase.co/...` em vez de `https://aliderdachapada.com.br/...`
2. **Funcao backend fora do ar**: A funcao que gera titulo e descricao para redes sociais esta retornando erro 404 (nao foi implantada com sucesso)
3. **Informacoes genericas**: O arquivo base do site (`index.html`) mostra "Lovable App" como titulo, entao qualquer preview mostra esse nome generico

## O Que Sera Feito

### 1. Corrigir o `index.html` com dados reais do site

Trocar as meta tags genericas ("Lovable App") pelas informacoes reais:
- Titulo: "Irece Lider - Portal de Noticias da Chapada Diamantina"
- Descricao: texto descritivo do site
- Imagem: o favicon ou logo do site

Isso garante que, ao compartilhar qualquer pagina do site, o preview mostrara pelo menos o nome e descricao corretos do site.

### 2. Usar a URL limpa do site para TODOS os compartilhamentos

O botao "WhatsApp" passara a enviar a URL real do site:
```
https://aliderdachapada.com.br/noticias/slug-da-noticia
```

Em vez da URL estranha da funcao backend.

### 3. Reimplantar a funcao backend `og-news`

A funcao sera reimplantada para que funcione corretamente. Ela continua disponivel para uso futuro (por exemplo, se no futuro quiser gerar previews com titulo especifico da noticia via link especial).

## Resultado Esperado

- **Copiar link**: copia `https://aliderdachapada.com.br/noticias/minha-noticia`
- **WhatsApp**: mostra a URL limpa do site, com preview mostrando "Irece Lider" e a descricao do portal
- **Mais (compartilhamento nativo)**: usa a URL real do site

## Limitacao Importante

Para que o WhatsApp mostre o **titulo especifico de cada noticia** (em vez do nome do site), seria necessario que o servidor do site gerasse o HTML com as meta tags de cada noticia individualmente. Como o site e uma aplicacao de pagina unica (SPA), o WhatsApp le apenas as meta tags fixas do `index.html`. Isso e uma limitacao tecnica desse tipo de aplicacao -- o preview generico do site ("Irece Lider") e o melhor resultado possivel com URLs limpas.

---

## Detalhes Tecnicos

### Arquivos a serem editados:

| Arquivo | Mudanca |
|---------|---------|
| `index.html` | Atualizar `<title>`, `og:title`, `og:description`, `og:image` com dados reais do Irece Lider |
| `src/components/news/ShareButtons.tsx` | Usar `siteUrl` para TODOS os botoes (WhatsApp, copiar link, nativo) -- remover uso da `ogUrl` |
| `supabase/functions/og-news/index.ts` | Reimplantar (deploy) para funcionar no servidor |

### Mudancas em `index.html`:
- `<title>` de "Lovable App" para "Irece Lider - Portal de Noticias"
- `og:title` para "Irece Lider"
- `og:description` para descricao do portal
- `og:image` para logo/favicon do site
- Remover referencias ao Lovable

### Mudancas em `ShareButtons.tsx`:
- Remover funcao `getOgUrl()` e variavel `SUPABASE_URL`
- `handleWhatsApp`: usar `siteUrl` em vez de `ogUrl`
- Simplificar o componente para usar apenas a URL do site em todos os casos

### Deploy da funcao backend:
- Reimplantar a funcao `og-news` para resolver o erro 404
- Manter o codigo existente (ja esta atualizado com o dominio correto)

