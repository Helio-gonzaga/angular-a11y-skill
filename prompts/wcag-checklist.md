# Checklist WCAG Para Auditoria

Use este checklist para classificar achados. Registre `Pass`, `Fail`, `Needs review` ou `Not applicable` quando fizer sentido.

## Perceptivel

- `1.1.1 Non-text Content`: imagens informativas, icones e botoes icon-only tem alternativa textual.
- `1.3.1 Info and Relationships`: labels, headings, listas, tabelas, grupos de campos e relacoes visuais estao expressos semanticamente.
- `1.3.2 Meaningful Sequence`: ordem do DOM e ordem visual fazem sentido para leitura e foco.
- `1.3.5 Identify Input Purpose`: campos comuns como nome, e-mail, telefone e endereco usam `autocomplete` apropriado quando aplicavel.
- `1.4.1 Use of Color`: informacao nao depende apenas de cor.
- `1.4.3 Contrast Minimum`: texto normal atende 4.5:1 e texto grande atende 3:1.
- `1.4.10 Reflow`: a tela permanece utilizavel em larguras pequenas sem perda de conteudo.
- `1.4.11 Non-text Contrast`: bordas, icones, estados e foco atendem contraste minimo de 3:1.
- `1.4.13 Content on Hover or Focus`: tooltip, menu e popover podem ser dispensados, acessados e mantidos sem bloquear uso.

## Operavel

- `2.1.1 Keyboard`: todas as funcoes sao operaveis por teclado.
- `2.1.2 No Keyboard Trap`: foco nao fica preso, exceto em modal aberto com saida esperada.
- `2.1.4 Character Key Shortcuts`: atalhos de tecla unica podem ser desligados, remapeados ou dependem de foco.
- `2.4.1 Bypass Blocks`: existe forma de pular blocos repetitivos quando a tela exige.
- `2.4.2 Page Titled`: titulo da pagina ou estado comunica o contexto atual.
- `2.4.3 Focus Order`: ordem de foco preserva significado e operacao.
- `2.4.4 Link Purpose`: links fazem sentido pelo texto ou contexto programatico.
- `2.4.6 Headings and Labels`: headings e labels descrevem topico ou finalidade.
- `2.4.7 Focus Visible`: foco e visivel em elementos operaveis.
- `2.4.11 Focus Appearance`: indicador de foco tem area e contraste suficientes quando aplicavel.
- `2.5.3 Label in Name`: nome acessivel contem o texto visivel em controles acionaveis.
- `2.5.8 Target Size Minimum`: alvos interativos tem tamanho ou espacamento suficiente quando aplicavel.

## Compreensivel

- `3.2.1 On Focus`: receber foco nao causa mudanca inesperada de contexto.
- `3.2.2 On Input`: alterar valor nao causa mudanca inesperada sem aviso.
- `3.2.3 Consistent Navigation`: navegacao recorrente mantem ordem consistente.
- `3.2.4 Consistent Identification`: componentes com mesma funcao sao identificados de forma consistente.
- `3.3.1 Error Identification`: erros sao identificados em texto.
- `3.3.2 Labels or Instructions`: campos tem instrucoes suficientes.
- `3.3.3 Error Suggestion`: erros indicam como corrigir quando possivel.
- `3.3.7 Redundant Entry`: informacoes ja fornecidas nao sao solicitadas de novo sem necessidade.
- `3.3.8 Accessible Authentication`: autenticacao nao depende apenas de teste cognitivo sem alternativa.

## Robusto

- `4.1.2 Name, Role, Value`: componentes customizados expoem nome, role, valor e estado.
- `4.1.3 Status Messages`: mensagens de status sao anunciadas sem mover foco quando apropriado.

## Mapeamento De Severidade 

- `1 - Grave`: bloqueia uma tarefa principal ou impede uso por teclado/leitor de tela.
- `2 - Medio`: dificulta uso, causa falha WCAG em componente importante ou afeta fluxo frequente, mas ha contorno razoavel.
- `3 - Leve`: problema localizado, informativo, cosmetico ou de baixa frequencia, ainda acionavel.

## Evidencia Minima Por Achado

Cada achado deve conter:

- tela ou estado
- seletor ou descricao do elemento
- comportamento observado
- impacto para usuario
- criterio WCAG relacionado
- passos de reproducao
- recomendacao de correcao Angular
