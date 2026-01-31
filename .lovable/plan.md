
## Plano: Correcoes de Upload de Imagens, Player Flutuante e Troca de Radio

### Resumo dos Problemas Identificados

Analisei o codigo e os logs para identificar as causas de cada problema:

---

### 1. Upload de Imagens dos Comunicadores

**Diagnostico:**
O componente `ImageUpload` esta correto e o bucket "media" existe com as politicas de storage configuradas. Verifiquei que uploads de banners estao funcionando (as URLs aparecem nos requests de rede).

**Possiveis causas:**
- Voce pode nao estar logado como admin quando tenta fazer upload
- A politica de storage exige autenticacao (`TO authenticated`)
- O componente pode nao estar passando o token de autenticacao corretamente

**Solucao:**
Vou adicionar melhor tratamento de erros no componente `ImageUpload` para mostrar mensagens mais claras sobre o que esta falhando, e verificar se o usuario esta autenticado antes de tentar upload.

**Arquivo afetado:**
- `src/components/admin/ImageUpload.tsx`

---

### 2. Popup Flutuante da Radio (Picture-in-Picture)

**Diagnostico:**
O erro no console e claro:
```
NotAllowedError: Opening a PiP window is only allowed from a top-level browsing context
```

**Explicacao:**
A API Document Picture-in-Picture so funciona em contextos "top-level" (janela principal do navegador). O preview do Lovable roda dentro de um iframe, o que impede o PiP de funcionar.

**Solucao:**
Como o PiP nao funciona em iframes, vou implementar uma alternativa visual: um **mini-player fixo** que aparece quando voce rola a pagina para baixo. Esse mini-player ficara no canto inferior da tela com:
- Logo da radio atual
- Botao de play/pause
- Botao de mudo/volume
- Botao para voltar ao player principal

Isso funcionara tanto no preview quanto no site publicado.

**Arquivos afetados:**
- `src/components/radio/MiniPlayer.tsx` (novo arquivo)
- `src/components/home/RadioPlayer.tsx` - Detectar scroll e mostrar mini-player
- `src/pages/Index.tsx` - Integrar o mini-player

---

### 3. Troca Automatica de Radio na Pagina "Nossas Radios"

**Diagnostico:**
O botao "Ouvir ao vivo" na pagina `/radios` nao esta conectado ao contexto do player. Ele apenas mostra o texto, mas nao executa nenhuma acao.

**Solucao:**
Conectar o botao ao contexto `RadioPlayerContext` para:
1. Trocar para a radio selecionada (`setCurrentRadio`)
2. Iniciar a reproducao automaticamente (`play`)
3. Mostrar feedback visual (toast de confirmacao)
4. Rolar a pagina para o topo ou mostrar o mini-player

**Arquivo afetado:**
- `src/pages/Radios.tsx`

---

### Detalhes Tecnicos

#### Mini-Player Fixo (Substituindo PiP)

O mini-player sera um componente fixo no canto inferior direito que aparece quando:
- O player principal sai da area visivel (scroll)
- Uma radio esta tocando

```text
+----------------------------------+
|                                  |
|   [Logo] Radio Name  [II] [🔊]  |
|                                  |
+----------------------------------+
```

Funcionalidades:
- Play/Pause
- Mute/Unmute  
- Clicar no nome volta ao player principal
- Animacao suave de entrada/saida

#### Conexao do Botao "Ouvir ao Vivo"

```typescript
const { setCurrentRadio, play } = useRadioPlayer();

const handlePlayRadio = (radio: Radio) => {
  // Converter formato do banco para formato do contexto
  const contextRadio = {
    id: radio.id,
    name: radio.name,
    frequency: radio.frequency,
    logo: radio.logo_url || "/placeholder.svg",
    streamUrl: radio.stream_url || "",
    tagline: radio.tagline || "",
    color: radio.color || "hsl(220, 70%, 45%)",
  };
  
  setCurrentRadio(contextRadio);
  play();
  
  toast({
    title: "Reproduzindo",
    description: `${radio.name} - ${radio.frequency}`,
  });
};
```

---

### Resumo das Alteracoes

| Problema | Solucao | Arquivos |
|----------|---------|----------|
| Upload de imagens | Melhorar tratamento de erros e verificar autenticacao | `ImageUpload.tsx` |
| PiP nao funciona | Mini-player fixo como alternativa | `MiniPlayer.tsx`, `RadioPlayer.tsx`, `Index.tsx` |
| Troca de radio | Conectar botao ao contexto do player | `Radios.tsx` |

---

### Comportamento Esperado Apos as Alteracoes

1. **Upload de Imagens**: Se houver erro, uma mensagem clara aparecera explicando o problema (ex: "Voce precisa estar logado para fazer upload")

2. **Mini-Player**: Quando voce rolar a pagina e o player principal sumir, um mini-player aparecera no canto inferior com controles de reproducao

3. **Pagina Radios**: Ao clicar em "Ouvir ao vivo", a radio sera trocada automaticamente, comecara a tocar, e voce vera uma confirmacao na tela
