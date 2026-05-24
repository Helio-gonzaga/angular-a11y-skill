<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Relatório de Acessibilidade - Exemplo</title>
    <style>
      :root {
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
          Exemplo de saída HTML gerada pela Angular A11y Skill para uma aplicação Angular local.
        </p>
      </header>

      <section class="summary-grid" aria-label="Resumo de erros">
        <div class="metric grave">
          <span>1 - Grave</span>
          <strong>0</strong>
        </div>
        <div class="metric medio">
          <span>2 - Médio</span>
          <strong>2</strong>
        </div>
        <div class="metric leve">
          <span>3 - Leve</span>
          <strong>0</strong>
        </div>
        <div class="metric ok">
          <span>Testes executados</span>
          <strong>10</strong>
        </div>
      </section>

      <section class="section" aria-labelledby="escopo-title">
        <h2 id="escopo-title">Escopo</h2>
        <table>
          <tbody>
            <tr>
              <th>Aplicação</th>
              <td>Cadastro de Pessoa</td>
            </tr>
            <tr>
              <th>URL</th>
              <td><code>http://localhost:4200</code></td>
            </tr>
            <tr>
              <th>Ferramentas</th>
              <td>Playwright, Axe Core, validações customizadas da Angular A11y Skill</td>
            </tr>
            <tr>
              <th>Telas e estados</th>
              <td>Tela inicial, formulário, mensagens de erro e tela de sucesso via controle condicional</td>
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
              <th>validações customizadas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge medio">Fail</span></td>
              <td>2</td>
              <td>0 violações nas tags WCAG configuradas</td>
              <td>2 falhas encontradas</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="section" aria-labelledby="achados-title">
        <h2 id="achados-title">Erros Encontrados</h2>
        <div class="findings">
          <article class="finding medio">
            <div class="finding-header">
              <div class="finding-title">
                <span class="badge medio">2 - Médio</span>
                <h3>Referências ARIA apontam para IDs que ainda não existem</h3>
              </div>
              <code>WCAG 4.1.2 Name, Role, Value</code>
            </div>
            <div class="finding-body">
              <div class="detail">
                <strong>Local</strong>
                <p><code>#sobrenome</code>, <code>#email</code>, <code>#sexo</code></p>
              </div>
              <div class="detail">
                <strong>Fonte</strong>
                <p>Teste customizado Playwright</p>
              </div>
              <div class="detail">
                <strong>Evidência</strong>
                <p>
                  Os campos usam <code>aria-describedby</code> apontando para
                  <code>sobrenome-error</code>, <code>email-error</code> e
                  <code>sexo-error</code>, mas esses elementos ainda não existem no DOM no estado inicial.
                </p>
              </div>
              <div class="detail">
                <strong>Impacto</strong>
                <p>
                  Tecnologias assistivas podem receber uma relação quebrada ou inconsistente entre campo
                  e mensagem de ajuda/erro.
                </p>
              </div>
              <div class="detail">
                <strong>Passos para reproduzir</strong>
                <ol class="steps">
                  <li>Abra <code>http://localhost:4200</code>.</li>
                  <li>Inspecione os campos do formulário antes de tocar nos inputs.</li>
                  <li>Observe que os IDs referenciados por <code>aria-describedby</code> não existem.</li>
                </ol>
              </div>
              <div class="detail">
                <strong>Recomendação Angular</strong>
                <p>
                  Use binding condicional em <code>[attr.aria-describedby]</code> para apontar para o erro
                  somente quando o erro estiver renderizado.
                </p>
              </div>
            </div>
          </article>

          <article class="finding medio">
            <div class="finding-header">
              <div class="finding-title">
                <span class="badge medio">2 - Médio</span>
                <h3>Mensagem de erro visível não está associada ao campo</h3>
              </div>
              <code>WCAG 3.3.1 Error Identification</code>
            </div>
            <div class="finding-body">
              <div class="detail">
                <strong>Local</strong>
                <p><code>#nome-error</code> e campo <code>#nome</code></p>
              </div>
              <div class="detail">
                <strong>Fonte</strong>
                <p>Teste customizado Playwright</p>
              </div>
              <div class="detail">
                <strong>Evidência</strong>
                <p>
                  A mensagem <code>O nome é obrigatório.</code> aparece, mas o input
                  <code>#nome</code> não usa <code>aria-describedby="nome-error"</code>.
                </p>
              </div>
              <div class="detail">
                <strong>Impacto</strong>
                <p>
                  Usuários de leitor de tela podem não perceber que a mensagem de erro pertence ao campo Nome.
                </p>
              </div>
              <div class="detail">
                <strong>Passos para reproduzir</strong>
                <ol class="steps">
                  <li>Abra a página.</li>
                  <li>Foque o campo Nome e saia sem preencher.</li>
                  <li>Observe a mensagem de erro visível sem associação programática com o input.</li>
                </ol>
              </div>
              <div class="detail">
                <strong>Recomendação Angular</strong>
                <p>
                  Adicione <code>[attr.aria-describedby]</code> e <code>[attr.aria-invalid]</code>
                  condicionais ao input Nome.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="section" aria-labelledby="correcao-title">
        <h2 id="correcao-title">Exemplo De Correção</h2>
        <pre><code>&lt;input
  id="nome"
  type="text"
  formControlName="nome"
  [attr.aria-invalid]="cadastroForm.get('nome')?.invalid &amp;&amp; cadastroForm.get('nome')?.touched ? 'true' : null"
  [attr.aria-describedby]="cadastroForm.get('nome')?.invalid &amp;&amp; cadastroForm.get('nome')?.touched ? 'nome-error' : null"
/&gt;</code></pre>
      </section>

      <section class="section" aria-labelledby="proximos-title">
        <h2 id="proximos-title">Próximos Passos</h2>
        <ol class="steps">
          <li>Corrigir os bindings condicionais de <code>aria-describedby</code>.</li>
          <li>Adicionar <code>aria-invalid</code> quando o campo estiver inválido e o erro estiver visível.</li>
          <li>Rodar novamente <code>npm run test:a11y</code>.</li>
          <li>Usar Playwright MCP para repetir a navegação por teclado.</li>
        </ol>
      </section>

      <p class="footer">Relatório gerado pela Angular A11y Skill.</p>
    </main>
  </body>
</html>
