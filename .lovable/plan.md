
# Plano: Aumentar a Altura dos Banners de Publicidade

## Situação Atual

Os banners estão usando as seguintes proporções (aspect ratio):
- **Mobile**: `aspect-[6/1]` → banner muito fino/horizontal (ex: 600x100px)
- **Desktop**: `aspect-[8/1]` → banner ainda mais fino (ex: 800x100px)

Essas proporções resultam em banners com pouca altura, dificultando a visualização do conteúdo publicitário.

## Alterações Propostas

Aumentar a proporção para deixar os banners mais altos e visíveis:

| Dispositivo | Atual | Nova Proporção | Tamanho Recomendado |
|-------------|-------|----------------|---------------------|
| Mobile | `6/1` (muito fino) | `4/1` | 800 x 200 px |
| Desktop | `8/1` (muito fino) | `5/1` | 1000 x 200 px |

## Detalhes Técnicos

### Arquivo: `src/components/home/AdBanner.tsx`

Alterar o aspect ratio em **3 locais**:

1. **Linha 92** - Banner com link:
   - De: `aspect-[6/1] md:aspect-[8/1]`
   - Para: `aspect-[4/1] md:aspect-[5/1]`

2. **Linha 99** - Banner sem link:
   - De: `aspect-[6/1] md:aspect-[8/1]`
   - Para: `aspect-[4/1] md:aspect-[5/1]`

3. **Linha 106** - Placeholder:
   - De: `aspect-[6/1] md:aspect-[8/1]`
   - Para: `aspect-[4/1] md:aspect-[5/1]`

## Resultado Visual

- **Antes**: Banners muito finos com aproximadamente 50-80px de altura
- **Depois**: Banners com aproximadamente 100-160px de altura (quase o dobro)

Os banners ficarão mais proeminentes e visíveis na página, melhorando a experiência do anunciante e a visualização do conteúdo publicitário.
