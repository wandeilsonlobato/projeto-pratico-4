# Guia de contribuição

Este documento descreve o fluxo de trabalho com Git e GitHub adotado no projeto.

## Modelo de branches

| Branch | Uso | Recebe merge de |
|---|---|---|
| `main` | Código em produção. Cada push dispara o deploy. Protegida. | `develop` (via PR) |
| `develop` | Integração das funcionalidades prontas. | `feature/*`, `fix/*`, `a11y/*`, `docs/*`, `perf/*` |
| `feature/<nome>` | Nova funcionalidade (sai da `develop`) | — |
| `hotfix/<nome>` | Correção urgente em produção (sai da `main`, volta para `main` e `develop`) | — |
| `fix/<nome>` | Correção de bug | — |
| `a11y/<nome>` | Melhoria de acessibilidade | — |
| `perf/<nome>` | Otimização | — |
| `docs/<nome>` | Documentação | — |

Nomes curtos, em minúsculas e com hífens: `feature/formulario-voluntario`, `a11y/contraste-cores`.

## Passo a passo

```bash
# 1. Atualizar a develop
git switch develop
git pull origin develop

# 2. Criar a branch de trabalho
git switch -c feature/minha-funcionalidade

# 3. Fazer commits pequenos e descritivos
git add <arquivos>
git commit -m "feat(cadastro): adiciona máscara de CEP"

# 4. Validar antes de enviar
npm run lint
npm run build

# 5. Enviar e abrir o pull request para a develop
git push -u origin feature/minha-funcionalidade
gh pr create --base develop --fill   # ou pela interface do GitHub
```

## Mensagens de commit (Conventional Commits)

Formato: `tipo(escopo opcional): descrição no imperativo, em minúsculas`

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `a11y` | Acessibilidade |
| `perf` | Performance / otimização |
| `style` | Ajustes visuais de CSS sem mudar comportamento |
| `refactor` | Reestruturação sem mudar comportamento |
| `docs` | Documentação |
| `ci` | Pipeline de integração/deploy |
| `chore` | Configuração, dependências, tarefas gerais |

Exemplos:

```
feat(projetos): adiciona barra de progresso de arrecadação
a11y(cadastro): associa mensagens de erro aos campos com aria-describedby
fix(menu): fecha o menu com a tecla Esc
perf: minifica HTML, CSS, JS e SVG no build
docs: adiciona instruções de deploy ao README
```

## Pull requests e revisão de código

1. Todo código chega à `develop` e à `main` **somente por pull request**.
2. Preencha o template do PR, incluindo o checklist de acessibilidade.
3. O workflow de CI precisa passar (lint + build).
4. Pelo menos **uma aprovação** de outra pessoa antes do merge.
5. Pontos observados na revisão:
   - HTML semântico e válido; imagens com `alt` adequado;
   - contraste de cores e foco visível;
   - funcionamento só com teclado;
   - nomes claros, sem código morto ou `console.log` esquecido.
6. Use **"Squash and merge"** para branches com muitos commits pequenos, ou **merge commit** para preservar o histórico.
7. Apague a branch depois do merge.

## Proteção da `main` (configuração no GitHub)

**Settings → Branches → Add branch protection rule** para `main`:

- ✅ Require a pull request before merging (1 aprovação)
- ✅ Require status checks to pass (`build`)
- ✅ Do not allow bypassing the above settings

## Versionamento e releases

Seguimos [SemVer](https://semver.org/lang/pt-BR/): `MAJOR.MINOR.PATCH`.

```bash
git switch main
git merge --no-ff develop
git tag -a v1.1.0 -m "v1.1.0: descrição da versão"
git push origin main --tags
```

Registre as mudanças no [CHANGELOG.md](CHANGELOG.md).
