# Template De Relatório HTML De Acessibilidade

Use este arquivo como instrução para gerar o relatório final da auditoria. A resposta final do agente deve ser **HTML completo**, pronto para salvar como `.html` e abrir no navegador.

Não entregue Markdown no relatório final. Entregue somente:

```html
<!doctype html>
<html lang="pt-BR">
...
</html>
```

## Escala De Gravidade

Classifique todo achado em uma destas categorias:

- `1 - Grave`: bloqueia tarefa principal, impede uso por teclado/leitor de tela, causa falha crítica em formulário, modal, navegação ou estado principal.
- `2 - Médio`: dificulta o uso, viola WCAG em componente importante, mas ainda existe contorno razoável.
- `3 - Leve`: problema localizado, informativo, cosmético ou de baixa frequência, ainda acionável.

Use cores consistentes:

- Grave: vermelho.
- Médio: laranja/amarelo.
- Leve: azul.
- Sucesso/sem erro: verde.
- Neutro/informativo: cinza.

## Campos Obrigatórios Por Erro

Cada erro deve apresentar:

- gravidade (`1 - Grave`, `2 - Médio`, `3 - Leve`)
- título curto
- local ou seletor
- critério WCAG relacionado
- evidência observada
- impacto para usuários
- passos para reproduzir
- recomendação de correção em Angular
- bloco `Como corrigir` com snippet Angular, HTML ou CSS quando aplicável
- fonte da descoberta: `Axe Core`, `Playwright MCP`, `Teste manual`, `Teste customizado`

## Estrutura HTML Obrigatória

Use esta estrutura como base. Substitua os textos de exemplo pelos achados reais.

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Relatório de Acessibilidade</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f8fb;
        --surface: #ffffff;
        --surface-muted: #f1f5f9;
        --text: #172033;
        --muted: #5d6b82;
        --border: #d8e0ea;
        --grave: #b42318;
        --grave-bg: #fff1f0;
        --grave-border: #ffb4ad;
        --medio: #a15c00;
        --medio-bg: #fff7e6;
        --medio-border: #ffd591;
        --leve: #175cd3;
        --leve-bg: #eff6ff;
        --leve-border: #9ec5fe;
        --ok: #067647;
        --ok-bg: #ecfdf3;
        --ok-border: #a6f4c5;
        --code-bg: #111827;
        --code-text: #e5e7eb;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.55;
      }

      .page {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 32px 0 56px;
      }

      header {
        margin-bottom: 24px;
      }

      h1,
      h2,
      h3 {
        margin: 0;
        line-height: 1.2;
      }

      h1 {
        font-size: 2rem;
      }

      h2 {
        margin-bottom: 14px;
        font-size: 1.35rem;
      }

      h3 {
        font-size: 1rem;
      }

      p {
        margin: 0;
      }

      a {
        color: var(--leve);
      }

      code {
        padding: 2px 5px;
        border-radius: 4px;
        background: var(--surface-muted);
        color: var(--text);
        font-size: 0.92em;
      }

      pre {
        overflow: auto;
        margin: 12px 0 0;
        padding: 14px;
        border-radius: 8px;
        background: var(--code-bg);
        color: var(--code-text);
      }

      pre code {
        padding: 0;
        background: transparent;
        color: inherit;
      }

      .subtitle {
        margin-top: 8px;
        color: var(--muted);
      }

      .section {
        margin-top: 18px;
        padding: 20px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
      }

      .metric {
        padding: 16px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
      }

      .metric strong {
        display: block;
        margin-top: 4px;
        font-size: 1.7rem;
        line-height: 1;
      }

      .metric span {
        color: var(--muted);
        font-size: 0.9rem;
      }

      .metric.grave {
        border-color: var(--grave-border);
        background: var(--grave-bg);
        color: var(--grave);
      }

      .metric.medio {
        border-color: var(--medio-border);
        background: var(--medio-bg);
        color: var(--medio);
      }

      .metric.leve {
        border-color: var(--leve-border);
        background: var(--leve-bg);
        color: var(--leve);
      }

      .metric.ok {
        border-color: var(--ok-border);
        background: var(--ok-bg);
        color: var(--ok);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid transparent;
        font-weight: 700;
        font-size: 0.82rem;
      }

      .badge.grave {
        border-color: var(--grave-border);
        background: var(--grave-bg);
        color: var(--grave);
      }

      .badge.medio {
        border-color: var(--medio-border);
        background: var(--medio-bg);
        color: var(--medio);
      }

      .badge.leve {
        border-color: var(--leve-border);
        background: var(--leve-bg);
        color: var(--leve);
      }

      .badge.ok {
        border-color: var(--ok-border);
        background: var(--ok-bg);
        color: var(--ok);
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 12px;
        border-bottom: 1px solid var(--border);
        text-align: left;
        vertical-align: top;
      }

      th {
        background: var(--surface-muted);
        color: var(--text);
        font-size: 0.86rem;
      }

      .findings {
        display: grid;
        gap: 14px;
      }

      .finding {
        border: 1px solid var(--border);
        border-left-width: 8px;
        border-radius: 8px;
        background: var(--surface);
        overflow: hidden;
      }

      .finding.grave {
        border-left-color: var(--grave);
      }

      .finding.medio {
        border-left-color: var(--medio);
      }

      .finding.leve {
        border-left-color: var(--leve);
      }

      .finding-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 16px 0;
      }

      .finding-title {
        display: grid;
        gap: 8px;
      }

      .finding-body {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        padding: 16px;
      }

      .detail {
        padding: 12px;
        border-radius: 8px;
        background: var(--surface-muted);
      }

      .detail strong {
        display: block;
        margin-bottom: 4px;
      }

      .steps {
        margin: 6px 0 0;
        padding-left: 20px;
      }

      .footer {
        margin-top: 22px;
        color: var(--muted);
        font-size: 0.9rem;
      }

      @media (max-width: 820px) {
        .summary-grid,
        .finding-body {
          grid-template-columns: 1fr;
        }

        .finding-header {
          display: grid;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header>
        <h1>Relatório de Acessibilidade</h1>
        <p class="subtitle">
          Auditoria de aplicação Angular com Playwright MCP, Axe Core e validações customizadas.
        </p>
      </header>

      <section class="summary-grid" aria-label="Resumo de erros">
        <div class="metric grave">
          <span>1 - Grave</span>
          <strong>0</strong>
        </div>
        <div class="metric medio">
          <span>2 - Médio</span>
          <strong>0</strong>
        </div>
        <div class="metric leve">
          <span>3 - Leve</span>
          <strong>0</strong>
        </div>
        <div class="metric ok">
          <span>Testes executados</span>
          <strong>0</strong>
        </div>
      </section>

      <section class="section" aria-labelledby="escopo-title">
        <h2 id="escopo-title">Escopo</h2>
        <table>
          <tbody>
            <tr>
              <th>Aplicação</th>
              <td>Nome da aplicação Angular</td>
            </tr>
            <tr>
              <th>URL</th>
              <td><code>http://localhost:4200</code></td>
            </tr>
            <tr>
              <th>Data</th>
              <td>AAAA-MM-DD</td>
            </tr>
            <tr>
              <th>Ferramentas</th>
              <td>Playwright MCP, Axe Core, validações customizadas da skill</td>
            </tr>
            <tr>
              <th>Telas e estados</th>
              <td>Tela inicial, formulários, modais, estados com <code>*ngIf</code>, telas sem Router</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="section" aria-labelledby="resultado-title">
        <h2 id="resultado-title">Resultado Automatizado</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Total de falhas</th>
              <th>Axe Core</th>
              <th>Validações customizadas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge grave">Fail</span></td>
              <td>0</td>
              <td>0 violações</td>
              <td>0 falhas</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="section" aria-labelledby="achados-title">
        <h2 id="achados-title">Erros Encontrados</h2>
        <div class="findings">
          <article class="finding grave">
            <div class="finding-header">
              <div class="finding-title">
                <span class="badge grave">1 - Grave</span>
                <h3>Título curto do erro grave</h3>
              </div>
              <code>WCAG 2.1.1 Keyboard</code>
            </div>
            <div class="finding-body">
              <div class="detail">
                <strong>Local</strong>
                <p><code>#seletor</code></p>
              </div>
              <div class="detail">
                <strong>Fonte</strong>
                <p>Axe Core ou Playwright MCP</p>
              </div>
              <div class="detail">
                <strong>Evidência</strong>
                <p>Descreva o comportamento observado.</p>
              </div>
              <div class="detail">
                <strong>Impacto</strong>
                <p>Explique como isso afeta usuários de teclado, baixa visão ou leitor de tela.</p>
              </div>
              <div class="detail">
                <strong>Passos para reproduzir</strong>
                <ol class="steps">
                  <li>Abra a URL auditada.</li>
                  <li>Navegue até o componente.</li>
                  <li>Observe a falha.</li>
                </ol>
              </div>
              <div class="detail">
                <strong>Recomendação Angular</strong>
                <p>Explique a correção no template/componente Angular.</p>
              </div>
              <div class="detail">
                <strong>Como corrigir</strong>
                <pre><code>&lt;input
  id="email"
  formControlName="email"
  [attr.aria-invalid]="email.invalid &amp;&amp; email.touched ? 'true' : null"
  [attr.aria-describedby]="email.invalid &amp;&amp; email.touched ? 'email-error' : null"
/&gt;</code></pre>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="section" aria-labelledby="correcoes-title">
        <h2 id="correcoes-title">Exemplos De Correção</h2>
        <pre><code>&lt;input
  id="email"
  formControlName="email"
  [attr.aria-invalid]="email.invalid &amp;&amp; email.touched ? 'true' : null"
  [attr.aria-describedby]="email.invalid &amp;&amp; email.touched ? 'email-error' : null"
/&gt;</code></pre>
      </section>

      <section class="section" aria-labelledby="proximos-passos-title">
        <h2 id="proximos-passos-title">Próximos Passos</h2>
        <ol class="steps">
          <li>Corrigir primeiro os erros classificados como <strong>1 - Grave</strong>.</li>
          <li>Corrigir os erros <strong>2 - Médio</strong>.</li>
          <li>Revisar os pontos <strong>3 - Leve</strong>.</li>
          <li>Rodar novamente <code>npm run test:a11y</code>.</li>
          <li>Repetir a navegação com Playwright MCP nos estados dinâmicos.</li>
        </ol>
      </section>

      <p class="footer">Relatório gerado pela Angular A11y Skill.</p>
    </main>
  </body>
</html>
```

## Regras Para O Agente

- Se não houver erros, use cards zerados e mostre status `Pass` em verde.
- Se houver erros, ordene por gravidade: `1 - Grave`, depois `2 - Médio`, depois `3 - Leve`.
- Não misture severidades antigas como `critical`, `serious`, `moderate` ou `minor` no relatório final.
- Converta impactos do Axe Core assim:
  - `critical` ou `serious` -> `1 - Grave`
  - `moderate` -> `2 - Médio`
  - `minor` -> `3 - Leve`
- Para falhas customizadas:
  - keyboard trap, controle inacessível por teclado, falta de `h1`, modal sem foco ou formulário bloqueado -> `1 - Grave`
  - contraste insuficiente, ARIA quebrado, erro de formulário sem associação, heading pulando nível -> `2 - Médio`
  - texto pouco claro, sugestão de melhoria, status não anunciado em fluxo secundário -> `3 - Leve`
- Escape todo código HTML exibido dentro de `<pre><code>`.
