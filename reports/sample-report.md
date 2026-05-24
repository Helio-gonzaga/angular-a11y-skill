# Relatorio De Acessibilidade - Exemplo

## Resumo Executivo

A auditoria de exemplo encontrou problemas que afetam uso por teclado, compreensao de formularios e percepcao visual. O fluxo principal pode ser usado parcialmente, mas alguns usuarios de teclado e leitor de tela teriam dificuldade para concluir tarefas sem correcao.

## Escopo

- Aplicacao: Angular demo local.
- URL: `http://localhost:4200`.
- Data: 2026-05-24.
- Navegador: Chromium via Playwright.
- Ferramentas: Playwright MCP, Axe Core, prompts da Angular A11y Skill.
- Telas e estados: pagina inicial, formulario de login, modal de confirmacao, painel aberto por `*ngIf`.

## Resultado Automatizado

| Status | Violacoes | Observacao |
| --- | ---: | --- |
| Fail | 3 | Axe Core apontou label ausente, contraste insuficiente e botao sem nome acessivel. |

IDs observados: `label`, `color-contrast`, `button-name`.

## Achados

| Severidade | WCAG | Local | Problema | Evidencia | Recomendacao |
| --- | --- | --- | --- | --- | --- |
| serious | 3.3.2 Labels or Instructions, 4.1.2 Name Role Value | Formulario de login | Campo de e-mail usa apenas placeholder | Axe `label`; seletor `input[type="email"]` sem `label` associado | Adicionar `<label for="email">E-mail</label>` e `id="email"` no input |
| serious | 2.1.1 Keyboard, 2.4.3 Focus Order | Modal de confirmacao | Foco sai do modal e alcanca conteudo ao fundo | Apos abrir modal, `Tab` chega ao link de navegacao atras do overlay | Aplicar focus trap, `aria-modal="true"`, fechar com `Escape` e restaurar foco |
| moderate | 1.4.3 Contrast Minimum | Botao secundario | Texto cinza sobre fundo branco tem contraste insuficiente | Axe `color-contrast`; texto do botao "Cancelar" | Ajustar token de cor para contraste minimo de 4.5:1 |
| moderate | 2.4.6 Headings and Labels | Dashboard sem Router | Estado "Relatorios" aparece sem heading principal | Conteudo muda via `*ngIf`, mas `h1` permanece "Inicio" | Atualizar heading do estado ativo ou mover foco para `h2` que descreve a secao |
| minor | 4.1.3 Status Messages | Resultado de busca | Mensagem "Nenhum resultado" nao e anunciada | Filtro altera lista sem foco e sem `aria-live` | Usar `role="status"` ou `aria-live="polite"` no container de resultado |

## Validacao Manual

### Labels E Nomes Acessiveis

O campo de e-mail nao possui label programatico. O botao icon-only de fechar modal nao possui `aria-label`. Os demais botoes com texto visivel mantem nome acessivel coerente.

### Heading Hierarchy

A pagina inicial possui `h1`. O painel de relatorios, exibido sem troca de rota, altera o conteudo principal mas nao atualiza o heading principal. Isso dificulta orientacao em tecnologias assistivas.

### ARIA

O modal usa `role="dialog"`, mas nao possui `aria-labelledby`. O botao que abre o modal nao atualiza `aria-expanded`.

### Teclado

O formulario e alcancavel por teclado. O modal apresenta falha porque o foco sai para elementos atras do overlay. `Escape` nao fecha o modal.

### Foco Visivel

Links do menu possuem foco visivel. O botao secundario tem foco pouco perceptivel por contraste baixo.

### Contraste

O botao secundario e uma mensagem de ajuda usam cinza claro com contraste abaixo do minimo. A cor de erro esta adequada quando acompanhada de texto.

### Angular

Os erros de formulario aparecem via `*ngIf`, mas nao estao ligados aos inputs por `aria-describedby`. O painel de resultados tambem aparece por `*ngIf` e precisa de anuncio ou foco quando substitui conteudo principal.

## Exemplos De Correcao

```html
<label for="email">E-mail</label>
<input
  id="email"
  type="email"
  formControlName="email"
  [attr.aria-invalid]="email.invalid && (email.touched || submitted) ? 'true' : null"
  [attr.aria-describedby]="email.invalid && (email.touched || submitted) ? 'email-error' : null"
/>
<p id="email-error" *ngIf="email.invalid && (email.touched || submitted)" role="alert">
  Informe um e-mail valido.
</p>
```

```html
<button type="button" aria-label="Fechar modal" (click)="closeDialog()">
  <span aria-hidden="true">×</span>
</button>
```

## Riscos Residuais

- Validar com dados reais para garantir mensagens de erro completas.
- Reexecutar teste de contraste depois da aplicacao dos tokens finais de tema.
- Validar comportamento com leitor de tela no fluxo de modal.

## Proximos Passos

1. Corrigir foco e teclado do modal.
2. Adicionar labels e nomes acessiveis ausentes.
3. Conectar erros Angular com `aria-describedby`.
4. Corrigir contraste dos tokens secundarios.
5. Reexecutar `npm run test:a11y` e repetir a navegacao por teclado com Playwright MCP.
