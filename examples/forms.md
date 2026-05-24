# Exemplo: Formularios Angular

Use este exemplo quando a auditoria envolver login, cadastro, checkout, filtros ou qualquer tela com Reactive Forms ou template-driven forms.

## Prompt De Auditoria

```txt
Valide o formulario atual da aplicacao Angular.

Verifique:
- cada campo tem label visivel e nome acessivel
- placeholder nao e usado como unico label
- erros aparecem em texto
- erros estao conectados por aria-describedby
- campos invalidos usam aria-invalid quando o erro esta visivel
- campos obrigatorios comunicam obrigatoriedade
- o formulario pode ser preenchido e enviado somente com teclado
- o foco vai para o primeiro erro ou para um resumo de erros apos submissao invalida
- mensagens dinamicas sao anunciaveis
```

## Padrao Recomendado Para Reactive Forms

```html
<form [formGroup]="loginForm" (ngSubmit)="submit()" novalidate>
  <div>
    <label for="email">E-mail</label>
    <input
      id="email"
      type="email"
      autocomplete="email"
      formControlName="email"
      [attr.aria-invalid]="email.invalid && (email.touched || submitted) ? 'true' : null"
      [attr.aria-describedby]="email.invalid && (email.touched || submitted) ? 'email-error' : 'email-help'"
    />
    <p id="email-help">Use o e-mail cadastrado na conta.</p>
    <p id="email-error" *ngIf="email.invalid && (email.touched || submitted)" role="alert">
      Informe um e-mail valido.
    </p>
  </div>

  <div>
    <label for="password">Senha</label>
    <input
      id="password"
      type="password"
      autocomplete="current-password"
      formControlName="password"
      [attr.aria-invalid]="password.invalid && (password.touched || submitted) ? 'true' : null"
      [attr.aria-describedby]="password.invalid && (password.touched || submitted) ? 'password-error' : null"
    />
    <p id="password-error" *ngIf="password.invalid && (password.touched || submitted)" role="alert">
      Informe a senha.
    </p>
  </div>

  <button type="submit">Entrar</button>
</form>
```

## Pontos De Atencao

- `novalidate` evita mensagens nativas inconsistentes quando a aplicacao tem mensagens proprias.
- `autocomplete` melhora experiencia e ajuda tecnologias assistivas.
- O texto visivel do botao deve fazer parte do nome acessivel.
- Use `aria-live="polite"` para resumo de erros quando o foco nao for movido ate ele.
- Se o submit falhar, uma estrategia comum e focar o primeiro campo invalido.

## Evidencia Que O Agente Deve Coletar

- Ordem de foco do formulario.
- Nome acessivel de cada campo.
- Estado antes e depois de submeter vazio.
- Mensagem exata exibida para cada erro.
- Se o leitor de tela teria relacao programatica entre campo e erro.
- Resultado do Axe Core para regras como `label`, `aria-valid-attr-value` e `color-contrast`.
