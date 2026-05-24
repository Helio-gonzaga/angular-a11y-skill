# Template De Relatorio De Acessibilidade

Use este formato para entregar a auditoria final. Substitua as instrucoes pelos dados observados durante a execucao.

## Resumo Executivo

Descreva em poucas frases o estado geral da acessibilidade, os riscos mais importantes e se a aplicacao pode seguir para correcao incremental ou precisa bloquear release.

## Escopo

- Aplicacao: nome da aplicacao Angular auditada.
- URL: URL validada.
- Data: data da auditoria.
- Navegador: navegador usado pelo Playwright.
- Ferramentas: Playwright MCP, Axe Core via `@axe-core/playwright`, prompts desta skill.
- Telas e estados: liste rotas, telas sem Router, modais, formularios, menus, abas e estados com `*ngIf`.

## Resultado Automatizado

Informe o resultado do Axe Core:

| Status | Violacoes | Observacao |
| --- | ---: | --- |
| Pass ou Fail | numero total | resumo objetivo |

Inclua IDs relevantes do Axe, como `color-contrast`, `label`, `aria-valid-attr-value` ou `button-name`, quando existirem.

## Achados

| Severidade | WCAG | Local | Problema | Evidencia | Recomendacao |
| --- | --- | --- | --- | --- | --- |
| critical | 2.1.1 Keyboard | Modal de confirmacao | Foco sai do modal aberto | `Tab` alcanca o conteudo ao fundo | Aplicar focus trap, fechar com `Escape` e restaurar foco no botao que abriu |

## Validacao Manual

### Labels E Nomes Acessiveis

Registre campos, botoes icon-only, links e componentes customizados avaliados.

### Heading Hierarchy

Registre a sequencia de headings observada e indique saltos ou ausencia de `h1`.

### ARIA

Registre atributos invalidos, referencias quebradas, roles incorretos e estados que nao atualizam.

### Teclado

Registre ordem de foco, atalhos usados, controles inacessiveis e keyboard traps.

### Foco Visivel

Registre controles sem indicador de foco ou com contraste insuficiente.

### Contraste

Registre pares de cor problemáticos, contexto visual e impacto.

### Angular

Registre problemas em Reactive Forms, template-driven forms, `*ngIf`, Angular Material, telas sem Router e componentes customizados.

## Exemplos De Correcao

Inclua snippets pequenos apenas quando ajudarem a equipe a corrigir o problema. Prefira exemplos Angular reais com binding de `aria-*`, associacao de `label` e controle de foco.

## Riscos Residuais

Liste pontos que precisam de validacao humana, ambiente com dados reais, leitor de tela especifico ou decisao de produto.

## Proximos Passos

Liste a ordem recomendada de correcao:

1. Corrigir bloqueios de teclado e foco.
2. Corrigir labels, nomes acessiveis e ARIA invalido.
3. Corrigir contraste e estados visuais.
4. Revisar formularios e mensagens dinamicas.
5. Rodar novamente Axe Core e uma navegacao manual com Playwright MCP.
