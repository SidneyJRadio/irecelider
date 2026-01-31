

## Plano: Fazer o Mascote Aparecer Por Cima do Menu Principal

### Problema Identificado
O mascote do player de rádio está sendo cortado pelo menu principal (Header). Isso acontece porque:
- O Header usa `sticky` com `z-50` e cria um novo contexto de empilhamento
- O mascote tem `z-[60]` mas está dentro de uma seção (`RadioPlayer`) que não tem um z-index alto o suficiente para competir com o Header
- O z-index do mascote só funciona dentro do seu contexto pai, não globalmente

### Solução
Aplicar um `z-index` maior na própria seção do `RadioPlayer` para que todo o contexto de empilhamento dela fique acima do Header.

### Alterações Técnicas

**Arquivo: `src/components/home/RadioPlayer.tsx`**

1. **Adicionar z-index na seção principal do player**:
   - Alterar a seção de `relative py-6` para `relative py-6 z-[60]`
   - Isso garante que todo o player (incluindo o mascote) fique acima do Header que usa `z-50`

2. **Manter o z-index no container do mascote**:
   - O `z-[60]` no container do mascote continua garantindo que ele fique acima de outros elementos dentro do player

### Resumo Visual da Mudança

```
Antes:
├── Header (z-50, sticky) ← por cima de tudo
└── RadioPlayer (sem z-index)
    └── Mascote (z-[60]) ← só funciona dentro do player

Depois:
├── RadioPlayer (z-[60]) ← agora compete com o Header
│   └── Mascote ← aparece por cima do Header
└── Header (z-50, sticky)
```

