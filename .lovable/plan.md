
# Plano: Aumentar o Mascote no Player de Rádio

## Objetivo

Aumentar significativamente o tamanho do mascote no player de rádio, permitindo que ele "transborde" para fora da área do player, dando mais destaque visual.

## Alterações Propostas

### Arquivo: `src/components/home/RadioPlayer.tsx`

**Linhas 100-107** - Ajustar o container e a imagem do mascote:

| Propriedade | Atual | Nova |
|-------------|-------|------|
| Altura Mobile | `h-16` (64px) | `h-24` (96px) |
| Altura Desktop | `h-24` (96px) | `h-36` (144px) |
| Posicionamento | Normal (dentro do fluxo) | Posição relativa com margem negativa para "transbordar" |

**Código atual:**
```tsx
<div className="flex items-center justify-center">
  <img 
    src={mascoteLider}
    alt="Mascote Líder - 1º Lugar em Audiência"
    className="h-16 md:h-24 w-auto object-contain drop-shadow-lg"
  />
</div>
```

**Código proposto:**
```tsx
<div className="flex items-center justify-center relative">
  <img 
    src={mascoteLider}
    alt="Mascote Líder - 1º Lugar em Audiência"
    className="h-24 md:h-36 w-auto object-contain drop-shadow-lg -my-4 md:-my-8"
  />
</div>
```

## Resultado Visual

- **Mobile**: Mascote aumenta de 64px para 96px de altura
- **Desktop**: Mascote aumenta de 96px para 144px de altura (50% maior)
- **Efeito de transbordamento**: A margem negativa (`-my-4` e `-my-8`) faz o mascote "sair" dos limites do player, criando um efeito de destaque sem quebrar o layout

O mascote ficará bem maior e mais proeminente, chamando mais atenção visual no player de rádio.
