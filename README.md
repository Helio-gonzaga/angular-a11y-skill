# Angular A11y Skill

Repositório de AI Skill para validação de acessibilidade em aplicações Angular usando Playwright MCP, Axe Core, prompts em Markdown e fluxo agentic.

Esta skill não cria uma aplicação Angular. Ela entrega contexto, prompts, exemplos e um teste Playwright reutilizável para que um agente de IA consiga inspecionar uma aplicação Angular existente, navegar pelos estados da interface e gerar um relatório de acessibilidade com evidências.

## O Que É

Angular A11y Skill é um pacote independente de instruções e automação para apoiar auditorias de acessibilidade em Angular. O agente usa os arquivos de `prompts/` como contexto operacional, pode navegar pela aplicação via Playwright MCP e pode executar o teste de Axe Core em `tests/accessibility.spec.ts`.

O fluxo cobre:

- labels e nomes acessíveis
- hierarquia de headings
- atributos `aria-*`
- navegação por teclado
- foco visível e gerenciamento de foco
- contraste
- formulários Angular reativos ou template-driven
- componentes condicionais com `*ngIf`
- telas Angular sem Angular Router

## Estrutura

```txt
angular-a11y-skill/
├── README.md
├── package.json
├── prompts/
│   ├── system.md
│   ├── accessibility-rules.md
│   ├── angular-best-practices.md
│   ├── wcag-checklist.md
│   └── report-template.md
├── examples/
│   ├── forms.md
│   ├── modal.md
│   └── headings.md
├── tests/
│   └── accessibility.spec.ts
└── reports/
    └── sample-report.md
```

## Como Usar Em Um Projeto Angular

1. Inicie a aplicação Angular alvo:

```bash
cd caminho/para/sua-aplicacao-angular
npm install
npm start
```

Por padrão, a skill espera a aplicação em `http://localhost:4200`.

2. Em outro terminal, instale as dependências da skill:

```bash
cd caminho/para/angular-a11y-skill
npm install
npm run playwright:install
```

3. Execute a validação automatizada com Axe Core:

```bash
npm run test:a11y
```

O comando gera automaticamente um relatório HTML em:

```txt
reports/accessibility-report.html
```

Esse relatório agrupa os erros por severidade:

- `1 - Grave`
- `2 - Medio`
- `3 - Leve`

## Como Usar Com Playwright MCP

Use Playwright MCP quando o agente precisar observar estados reais da interface, abrir menus, preencher formulários, acionar modais, testar foco e registrar evidências visuais ou estruturais.

Fluxo recomendado:

1. Carregar `prompts/system.md` como regra principal do agente.
2. Carregar `prompts/accessibility-rules.md`, `prompts/angular-best-practices.md` e `prompts/wcag-checklist.md` como contexto de auditoria.
3. Iniciar a aplicação Angular local em `http://localhost:4200`.
4. Navegar pela aplicação com Playwright MCP.
5. Executar o teste `npm run test:a11y` para coletar violações automatizadas do Axe Core.
6. Complementar com validação manual assistida por MCP: teclado, foco, estados com `*ngIf`, modais, mensagens de erro e contraste.
7. Gerar relatório HTML usando `prompts/report-template.md`.

O agente deve registrar evidências como seletor, texto visível, caminho de teclado, estado da tela e recomendação de correção Angular.

## Como Usar Com Git Submodule

Em um repositório Angular existente:

```bash
git submodule add https://github.com/sua-org/angular-a11y-skill tools/angular-a11y-skill
git submodule update --init --recursive
```

Instale e rode a skill dentro do submodule:

```bash
cd tools/angular-a11y-skill
npm install
npm run playwright:install
npm run test:a11y
```

Para atualizar o submodule depois que esta skill evoluir:

```bash
git -C tools/angular-a11y-skill pull --ff-only origin main
git add tools/angular-a11y-skill
git commit -m "chore: update angular a11y skill"
```

## Arquitetura Do Fluxo

```txt
Agente de IA
   |
   | carrega prompts Markdown
   v
Angular A11y Skill
   |
   | define regras, checklist e template de relatório
   v
Playwright MCP
   |
   | navega, interage, captura estados e testa teclado
   v
Aplicação Angular local
   |
   | DOM renderizado, estados com *ngIf, formulários e componentes
   v
Axe Core via Playwright
   |
   | detecta violações automatizadas WCAG
   v
Relatório HTML
```

## Exemplo De Prompt Para O Agente

```txt
Use este repositório como Angular A11y Skill.

Leia:
- prompts/system.md
- prompts/accessibility-rules.md
- prompts/angular-best-practices.md
- prompts/wcag-checklist.md
- prompts/report-template.md

Valide a aplicação Angular em http://localhost:4200 usando Playwright MCP.

Execute também:
npm run test:a11y

Audite:
- labels e nomes acessíveis
- hierarquia de headings
- atributos aria-*
- navegação por teclado
- foco visível
- contraste
- formulários Angular
- componentes com *ngIf
- telas sem Angular Router

Gere um relatório final em HTML seguindo prompts/report-template.md, com severidade `1 - Grave`, `2 - Medio` e `3 - Leve`, evidência, WCAG relacionado, passos de reprodução e sugestão de correção em Angular.
```

## Limites Da Automação

Axe Core encontra muitos problemas estruturais, mas não substitui inspeção assistida por agente. O agente deve complementar o teste automatizado com navegação por teclado, avaliação de conteúdo visível, fluxo de foco, estados condicionais, mensagens de erro e usabilidade real de componentes.

## Licença

MIT
