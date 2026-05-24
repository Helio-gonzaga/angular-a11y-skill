# Boas Praticas Angular Para Acessibilidade

Use este guia para transformar achados em correcoes praticas dentro de templates Angular.

## Preferir HTML Semantico

Prefira elementos nativos:

```html
<button type="button" (click)="save()">Salvar</button>
<a routerLink="/clientes">Clientes</a>
<label for="email">E-mail</label>
<input id="email" type="email" formControlName="email" />
```

Evite recriar comportamento nativo com `div` ou `span`:

```html
<!-- Evitar -->
<div role="button" tabindex="0" (click)="save()">Salvar</div>
```

Se um elemento customizado for inevitavel, implemente foco, teclado, role, nome acessivel e estado programatico.

## Reactive Forms

Padrao recomendado:

```html
<label for="email">E-mail</label>
<input
  id="email"
  type="email"
  formControlName="email"
  [attr.aria-invalid]="email.invalid && (email.touched || submitted) ? 'true' : null"
  [attr.aria-describedby]="email.invalid && (email.touched || submitted) ? 'email-error' : 'email-help'"
/>
<p id="email-help">Use o e-mail corporativo.</p>
<p id="email-error" *ngIf="email.invalid && (email.touched || submitted)" role="alert">
  Informe um e-mail valido.
</p>
```

Boas praticas:

- Exponha getters no componente para controles usados no template.
- Use `aria-describedby` para ajuda e erro.
- Use `role="alert"` somente quando a mensagem precisa ser anunciada imediatamente.
- Nao mostre erro agressivo antes da interacao do usuario, salvo regras especificas do produto.
- Se uma submissao falhar, leve o foco para um resumo de erros ou para o primeiro campo invalido.

## Template-Driven Forms

Padrao recomendado:

```html
<label for="name">Nome</label>
<input
  id="name"
  name="name"
  required
  [(ngModel)]="model.name"
  #nameModel="ngModel"
  [attr.aria-invalid]="nameModel.invalid && (nameModel.touched || submitted) ? 'true' : null"
  [attr.aria-describedby]="nameModel.invalid && (nameModel.touched || submitted) ? 'name-error' : null"
/>
<p id="name-error" *ngIf="nameModel.invalid && (nameModel.touched || submitted)" role="alert">
  Informe o nome.
</p>
```

## Componentes Com `*ngIf`

Ao renderizar conteudo condicional:

```html
<button
  type="button"
  aria-haspopup="dialog"
  [attr.aria-expanded]="isDialogOpen"
  aria-controls="delete-dialog"
  (click)="openDialog()"
>
  Excluir
</button>

<section
  *ngIf="isDialogOpen"
  id="delete-dialog"
  role="dialog"
  aria-modal="true"
  aria-labelledby="delete-dialog-title"
>
  <h2 id="delete-dialog-title">Confirmar exclusao</h2>
  <button type="button" (click)="closeDialog()">Cancelar</button>
  <button type="button" (click)="confirmDelete()">Confirmar</button>
</section>
```

Verifique:

- O elemento que abre o estado comunica expansao ou contexto quando necessario.
- O conteudo renderizado tem nome acessivel.
- O foco vai para o novo contexto quando a mudanca for significativa.
- O foco retorna ao elemento de origem quando o contexto fecha.
- IDs usados em ARIA existem no DOM quando referenciados.

## Angular Material

Quando Angular Material estiver presente:

- Use `mat-label` em `mat-form-field`.
- Use `mat-error` para erros e conecte mensagens quando necessario.
- Confirme que `mat-dialog-title` esta associado ao dialog.
- Valide foco inicial e retorno de foco em `MatDialog`.
- Nao assuma que o componente e acessivel se o template de conteudo interno nao tiver labels, headings ou textos claros.

## Telas Com Angular Router

- Cada rota deve ter heading principal coerente com a tela.
- Atualize o titulo do documento quando a rota muda.
- Depois de navegacao programatica, considere mover foco para o heading principal ou container principal.
- Links ativos devem comunicar estado visualmente e programaticamente quando relevante.

## Telas Sem Angular Router

Em dashboards, wizards, tabs ou shells que trocam conteudo sem rota:

- Trate cada estado principal como uma tela.
- Atualize heading visivel quando o conteudo principal mudar.
- Mova foco para o inicio do novo conteudo se a mudanca substituir a tarefa atual.
- Use `aria-live="polite"` para atualizacoes que nao devem roubar foco.
- Use tabs reais quando a interacao for de abas; nao use apenas botoes soltos sem relacao programatica.

## Contraste E Estados Visuais

- Defina tokens de cor com pares de primeiro plano e fundo testados.
- Valide foco, hover, disabled, erro, sucesso e aviso.
- Nao use opacidade baixa em texto desabilitado quando o texto ainda precisa ser lido.
- Icones informativos precisam de alternativa textual ou nome acessivel.

## Revisao De Codigo

Procure no template por:

```txt
<input
<select
<textarea
placeholder=
aria-
role=
tabindex=
outline: none
*ngIf
ngSwitch
formControlName
[(ngModel)]
```

Use esses pontos como trilha para localizar riscos, mas confirme comportamento real no navegador.
