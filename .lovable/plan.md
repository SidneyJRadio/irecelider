

## Plano: Expandir Sistema de Banners

### O que precisa ser feito

1. **Inserir os 2 banners faltantes** (above_communicators) - prontos para receber imagens
2. **Remover a limitacao de slots** - permitir adicionar quantos banners quiser
3. **Atualizar o layout do frontend** - exibir todos os banners de cada posicao em carrossel ou grid flexivel

---

### Parte 1: Inserir Banners Vazios no Banco de Dados

Adicionar 2 registros na tabela `banners` para a posicao "above_communicators":
- Banner slot 1: titulo "Banner Comunicadores 1", sem imagem (placeholder), inativo
- Banner slot 2: titulo "Banner Comunicadores 2", sem imagem (placeholder), inativo

Esses banners ficarao visiveis no painel admin para voce adicionar as imagens.

---

### Parte 2: Atualizar Formulario de Banners

**Remover o campo "Slot"** do formulario e substituir por:
- Campo de "Ordem de exibicao" (numero para ordenar os banners)
- Permitir criar quantos banners quiser para cada posicao

**Atualizar validacao:**
- Nao exigir mais que slot seja 1 ou 2
- Usar display_order para ordenar os banners

---

### Parte 3: Atualizar Componente AdBanner no Frontend

**Mudar de grid fixo (2 colunas) para layout dinamico:**

Opcao A - **Carrossel automatico** (se houver mais de 2 banners):
- Exibe 2 banners por vez no desktop
- Roda automaticamente entre os banners
- Permite navegacao manual

Opcao B - **Grid flexivel** (todos visiveis):
- Exibe todos os banners ativos
- Desktop: 2 por linha
- Mobile: 1 por linha

**Recomendacao:** Opcao A (carrossel) para nao ocupar muito espaco vertical.

---

### Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| Banco de dados | Inserir 2 banners para "above_communicators" |
| `src/pages/admin/BannersAdmin.tsx` | Remover limite de slots, usar display_order |
| `src/components/home/AdBanner.tsx` | Exibir todos banners em carrossel ou grid |

---

### Estrutura do Banco Atualizada

Banners apos as alteracoes:

| Titulo | Posicao | Ordem | Imagem | Ativo |
|--------|---------|-------|--------|-------|
| radio clube fm jacobina | above_news | 1 | ✓ | ✓ |
| serrana | above_news | 2 | ✓ | ✓ |
| Banner Comunicadores 1 | above_communicators | 1 | (vazio) | ✗ |
| Banner Comunicadores 2 | above_communicators | 2 | (vazio) | ✗ |

Voce podera adicionar mais banners livremente em cada posicao!

