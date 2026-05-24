# Exemplo: Modal Angular

Use este exemplo para dialog, confirmation modal, drawer, popover bloqueante ou painel aberto com `*ngIf`.

## Prompt De Auditoria

```txt
Valide o modal atual da aplicacao Angular.

Verifique:
- o botao que abre o modal e acessivel por teclado
- o modal tem role adequado
- o modal tem nome acessivel por titulo
- o foco entra no modal ao abrir
- o foco fica contido no modal enquanto ele esta aberto
- Escape fecha o modal quando esperado
- o foco retorna para o botao que abriu
- o conteudo ao fundo nao fica operavel por teclado
- IDs usados em aria-labelledby e aria-controls existem quando o modal esta renderizado
```

## Estrutura Recomendada

```html
<button
  #deleteButton
  type="button"
  aria-haspopup="dialog"
  aria-controls="delete-dialog"
  [attr.aria-expanded]="isDeleteDialogOpen"
  (click)="openDeleteDialog()"
>
  Excluir conta
</button>

<section
  *ngIf="isDeleteDialogOpen"
  id="delete-dialog"
  role="dialog"
  aria-modal="true"
  aria-labelledby="delete-dialog-title"
  tabindex="-1"
>
  <h2 id="delete-dialog-title">Excluir conta?</h2>
  <p>Esta acao nao pode ser desfeita.</p>

  <button type="button" (click)="closeDeleteDialog()">Cancelar</button>
  <button type="button" (click)="confirmDelete()">Confirmar exclusao</button>
</section>
```

## Boas Praticas De Foco

- Armazene o elemento que abriu o modal.
- Ao abrir, mova foco para o titulo, container do dialog ou primeiro controle apropriado.
- Enquanto aberto, mantenha foco dentro do modal.
- Ao fechar, restaure foco para o elemento que abriu.
- Ao remover o modal com `*ngIf`, garanta que o foco nao caia no `body`.

## Quando Usar Angular CDK

Se o projeto tiver Angular CDK, prefira `cdkTrapFocus` para conter foco:

```html
<section
  *ngIf="isOpen"
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  cdkTrapFocus
  cdkTrapFocusAutoCapture
>
  <h2 id="dialog-title">Editar perfil</h2>
  <button type="button" (click)="close()">Fechar</button>
</section>
```

## Falhas Comuns

- Modal visual sem `role="dialog"` ou `aria-modal`.
- Titulo visual sem associacao por `aria-labelledby`.
- Foco permanece no botao ao fundo.
- `Tab` alcanca links atras do overlay.
- Fechar modal remove o elemento focado e deixa foco no `body`.
- Botao icon-only de fechar sem nome acessivel.
