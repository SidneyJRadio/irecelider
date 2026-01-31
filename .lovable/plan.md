
# Plano: Corrigir Banners Desaparecendo no Desktop

## Problema Identificado

O componente `AdBanner` está renderizando o placeholder "Espaço para anúncio" em vez das imagens reais dos banners no desktop. Isso acontece devido a um problema de sincronização entre o estado `currentIndex` e a mudança no valor de `bannersPerPage` quando o hook `useIsMobile` muda de estado.

## Causa Raiz

O hook `useIsMobile` pode mudar de valor após a primeira renderização (hydration), fazendo com que:
1. Inicialmente `isMobile` seja `undefined` → tratado como `false` (desktop)
2. Depois de um momento, mude para o valor correto
3. Se `currentIndex` não for resetado quando `bannersPerPage` muda, o slice pode retornar banners incorretos ou vazios

## Solução

Adicionar um `useEffect` para resetar o `currentIndex` para 0 sempre que `bannersPerPage` mudar, garantindo que o carrossel sempre comece da primeira página quando a orientação (mobile/desktop) mudar.

## Alterações Técnicas

### Arquivo: `src/components/home/AdBanner.tsx`

1. **Adicionar useEffect para sincronizar currentIndex com bannersPerPage**:
   - Quando `bannersPerPage` muda (usuário redimensiona a janela ou durante hydration), resetar `currentIndex` para 0
   - Isso evita que o índice fique "fora do range" causando arrays vazios

```typescript
// Após a linha 48, adicionar:
useEffect(() => {
  setCurrentIndex(0);
}, [bannersPerPage]);
```

2. **Adicionar verificação de segurança no getCurrentBanners**:
   - Garantir que sempre retorne banners válidos mesmo se houver problemas de sincronização

```typescript
const getCurrentBanners = () => {
  const startIndex = currentIndex * bannersPerPage;
  const result = banners.slice(startIndex, startIndex + bannersPerPage);
  // Se não houver banners nesse índice, voltar para o início
  if (result.length === 0 && banners.length > 0) {
    return banners.slice(0, bannersPerPage);
  }
  return result;
};
```

## Resultado Esperado

- Os banners serão exibidos corretamente lado a lado no desktop (2 por vez)
- No mobile, 1 banner por vez com carrossel
- Mudança de tamanho de tela não causará desaparecimento dos banners
- O carrossel funcionará corretamente em ambas as orientações
