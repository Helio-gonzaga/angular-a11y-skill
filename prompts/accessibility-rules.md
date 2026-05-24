# Regras De Acessibilidade

Use estas regras como checklist operacional durante a auditoria. Elas complementam Axe Core e devem orientar a navegacao manual com Playwright MCP.

## Labels E Nomes Acessiveis

- Todo `input`, `select` e `textarea` deve ter nome acessivel.
- Prefira `<label for="id">` associado a `id` estavel.
- Em componentes Angular customizados, garanta que o controle interno receba o label ou que o componente exponha um nome acessivel.
- Placeholder nao substitui label.
- Botoes com apenas icone devem ter texto acessivel por `aria-label`, texto visual oculto de forma acessivel ou conteudo textual equivalente.
- Links devem informar destino ou acao. Evite textos como "clique aqui" sem contexto.
- Grupos de radio e checkboxes relacionados devem usar `fieldset` e `legend` ou uma associacao equivalente.
- Mensagens de ajuda e erro devem ser conectadas ao controle com `aria-describedby`.
- Campos invalidos devem refletir estado com `aria-invalid="true"` quando o erro estiver visivel ou quando o campo tiver sido submetido.

## Hierarquia De Headings

- Cada tela ou estado principal deve ter um heading principal claro, normalmente um `h1`.
- Nao pule niveis sem motivo. Depois de `h1`, use `h2` para secoes principais, `h3` para subsecoes e assim por diante.
- Nao use heading apenas por tamanho visual. Use CSS para estilo e headings para estrutura.
- Em telas sem Angular Router, estados trocados por abas, filtros, `ngSwitch` ou `*ngIf` ainda precisam de heading coerente.
- Modais devem ter um titulo programaticamente associado, como `aria-labelledby`.

## ARIA

- Use ARIA somente quando HTML semantico nao for suficiente.
- Valide se cada `aria-*` usado e permitido para o role do elemento.
- Nao coloque `aria-hidden="true"` em elementos que contem foco ou controles interativos.
- Elementos com `role="button"` devem ser focaveis e ativaveis por `Enter` e `Space`. Prefira `<button>`.
- Elementos expansivos devem atualizar `aria-expanded`.
- Quando `aria-controls` for usado, o `id` referenciado deve existir no DOM no estado atual.
- Abas devem seguir o padrao de tabs: `tablist`, `tab`, `tabpanel`, `aria-selected`, foco por setas e associacao por `aria-controls` ou `aria-labelledby`.
- Mensagens dinamicas importantes devem usar `aria-live`, `role="status"` ou `role="alert"` conforme urgencia.
- Nao use `role="presentation"` ou `role="none"` em elementos que precisam expor semantica.

## Teclado

- Todo controle interativo deve ser acessivel por teclado.
- A ordem de foco deve seguir a ordem visual e logica.
- Evite `tabindex` positivo.
- `Tab` e `Shift+Tab` devem percorrer a interface sem saltos inesperados.
- `Enter` deve ativar links e botoes quando aplicavel.
- `Space` deve ativar botoes, checkboxes e opcoes selecionaveis quando aplicavel.
- `Escape` deve fechar modal, menu ou popover quando esse comportamento for esperado.
- Componentes como menu, combobox, tabs e listbox devem suportar setas conforme o padrao do componente.
- Nao deve existir keyboard trap, exceto foco contido dentro de modal aberto. Ao fechar o modal, o foco deve retornar ao elemento que abriu o modal.

## Foco Visivel

- Todo elemento focavel deve ter indicador de foco visivel.
- Nao use `outline: none` sem fornecer alternativa clara.
- O indicador de foco deve ter contraste suficiente contra o fundo.
- O foco deve aparecer no elemento correto, nao em um container invisivel.
- Estados criados com `*ngIf` devem receber foco de forma previsivel quando representam uma mudanca de contexto, como modal ou painel de erro.
- Ao remover um elemento focado com `*ngIf`, mova ou restaure o foco para um ponto seguro.

## Contraste

- Texto normal deve atender contraste minimo de 4.5:1.
- Texto grande deve atender contraste minimo de 3:1.
- Componentes de interface, bordas significativas, icones informativos e indicadores de foco devem atender contraste minimo de 3:1.
- Nao transmita informacao apenas por cor. Use texto, icone com nome acessivel, padrao visual ou mensagem.
- Estados de erro, sucesso e aviso precisam ser distinguiveis por mais de uma pista.

## Formularios Angular

- Reactive Forms e template-driven forms devem expor erros somente quando o usuario interagiu, quando o campo foi submetido ou quando a regra de produto exigir feedback imediato.
- Erros visiveis devem estar ligados ao controle por `aria-describedby`.
- Use `aria-invalid` com base em `control.invalid` combinado com `control.touched`, `control.dirty` ou `submitted`.
- Mensagens globais de erro devem ser anunciaveis e focaveis quando bloqueiam a conclusao de uma tarefa.
- Campos obrigatorios devem comunicar obrigatoriedade visualmente e programaticamente.

## Componentes Com `*ngIf`

- Quando um modal, menu, alerta, painel ou mensagem aparece por `*ngIf`, avalie o estado antes e depois.
- Confirme se IDs referenciados por `aria-controls`, `aria-describedby` e `aria-labelledby` existem quando o estado esta renderizado.
- Garanta que elementos removidos do DOM nao deixem foco perdido no `body`.
- Estados dinamicos importantes devem ser anunciados por `aria-live` ou por mudanca de foco controlada.

## Telas Sem Angular Router

- Aplicacoes de uma pagina ou componentes sem rotas ainda precisam de estrutura de tela.
- Cada estado principal deve ter titulo, landmarks e foco inicial coerente.
- Mudancas de estado que simulam navegacao devem atualizar heading visivel e, quando apropriado, titulo do documento ou anuncio de status.
- Validar somente a rota raiz nao e suficiente se a interface troca conteudo por abas, filtros, steppers, accordions ou `*ngIf`.
