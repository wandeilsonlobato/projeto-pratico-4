# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [1.0.1] — 2026-09-28

### Corrigido
- Telefone do rodapé com espaço e hífen não separáveis, evitando quebra de linha no meio do número.
- `autocomplete="street-address"` (válido apenas em `textarea`) trocado por `address-line1` no campo de endereço.
- Removido `role="list"` redundante da lista de indicadores de impacto.

## [1.0.0] — 2026-09-28

### Adicionado
- Páginas Início, Projetos e Cadastro de voluntário.
- Menu responsivo acessível e modo alto contraste.
- Formulário com máscaras, validação de CPF/idade e resumo de erros.
- Página 404 personalizada e `robots.txt`.
- Build de produção com minificação de HTML, CSS, JS e SVG e hash de cache.
- Pipeline de CI/CD no GitHub Actions com deploy no GitHub Pages.
- Documentação: README, guia de contribuição, relatório de acessibilidade.

### Acessibilidade
- Auditoria WCAG 2.1 AA e correções registradas em `docs/ACESSIBILIDADE.md`.
