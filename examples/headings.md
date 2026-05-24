# Exemplo: Headings Em Angular

Use este exemplo para validar estrutura de paginas, dashboards, tabs, wizards e telas sem Angular Router.

## Prompt De Auditoria

```txt
Mapeie a hierarquia de headings da tela atual.

Verifique:
- existe um h1 que descreve a tela ou tarefa principal
- headings nao pulam niveis sem justificativa
- headings nao sao usados apenas para tamanho visual
- cada modal tem titulo associado
- cada estado sem Angular Router tem titulo claro
- tabs, accordions e steppers preservam estrutura compreensivel
```

## Estrutura Recomendada Para Uma Rota

```html
<main>
  <h1>Clientes</h1>

  <section aria-labelledby="filters-title">
    <h2 id="filters-title">Filtros</h2>
    <!-- campos de filtro -->
  </section>

  <section aria-labelledby="results-title">
    <h2 id="results-title">Resultados</h2>
    <!-- tabela ou lista -->
  </section>
</main>
```

## Estrutura Recomendada Sem Angular Router

Quando a tela troca o conteudo principal por estado local:

```html
<main>
  <h1>Cadastro de produto</h1>

  <nav aria-label="Etapas do cadastro">
    <button type="button" [attr.aria-current]="step === 'dados' ? 'step' : null">Dados</button>
    <button type="button" [attr.aria-current]="step === 'preco' ? 'step' : null">Preco</button>
    <button type="button" [attr.aria-current]="step === 'revisao' ? 'step' : null">Revisao</button>
  </nav>

  <section *ngIf="step === 'dados'" aria-labelledby="dados-title">
    <h2 id="dados-title">Dados do produto</h2>
  </section>

  <section *ngIf="step === 'preco'" aria-labelledby="preco-title">
    <h2 id="preco-title">Preco e disponibilidade</h2>
  </section>

  <section *ngIf="step === 'revisao'" aria-labelledby="revisao-title">
    <h2 id="revisao-title">Revisao antes de publicar</h2>
  </section>
</main>
```

## Falhas Comuns

- `h1` ausente porque o titulo esta apenas em componente visual.
- Sequencia `h1 > h4` por escolha de tamanho.
- Varios `h1` concorrentes em cards independentes.
- Modal com `h2` visual, mas sem `aria-labelledby`.
- Tela sem Router troca todo o conteudo e mantem heading antigo.

## Evidencia Que O Agente Deve Coletar

- Lista de headings em ordem.
- Estado visual em que cada heading aparece.
- Se o heading principal muda quando o conteudo principal muda.
- Se headings ocultos estao realmente disponiveis para tecnologia assistiva.
- Se a estrutura ajuda a navegar por secoes e tarefas.
