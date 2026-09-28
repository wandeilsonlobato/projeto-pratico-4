# ONG Semear Futuro — site institucional

Site institucional da **ONG Semear Futuro** (organização fictícia), desenvolvido na **Experiência Prática IV** da disciplina de Desenvolvimento Front-end.
O projeto aplica práticas profissionais de **versionamento com Git/GitHub**, **acessibilidade WCAG 2.1 nível AA**, **otimização para produção** e **deploy contínuo**.

🔗 **Site em produção:** <https://wandeilsonlobato.github.io/projeto-pratico-4/>
📦 **Repositório:** <https://github.com/wandeilsonlobato/projeto-pratico-4>

---

## Sumário

1. [Funcionalidades](#funcionalidades)
2. [Tecnologias](#tecnologias)
3. [Estrutura de pastas](#estrutura-de-pastas)
4. [Instalação e execução local](#instalação-e-execução-local)
5. [Scripts disponíveis](#scripts-disponíveis)
6. [Build de produção](#build-de-produção)
7. [Deploy](#deploy)
8. [Acessibilidade](#acessibilidade)
9. [Fluxo de trabalho com Git](#fluxo-de-trabalho-com-git)
10. [Manutenção](#manutenção)
11. [Licença](#licença)

---

## Funcionalidades

| Página | Conteúdo |
|---|---|
| `index.html` | Apresentação, missão/visão/valores, indicadores de impacto e tabela de transparência financeira |
| `projetos.html` | Cards dos projetos com barra de progresso de arrecadação e seção "Como ajudar" (acordeão nativo) |
| `cadastro.html` | Formulário de voluntário com máscaras (CPF, telefone, CEP), validação de CPF e idade, e mensagens de erro acessíveis |

Recursos globais:

- Menu responsivo (hambúrguer em telas pequenas) operável por teclado, fecha com **Esc**.
- Botão **Alto contraste**, com a preferência salva no navegador.
- Link **"Pular para o conteúdo principal"**.
- Página `404.html` personalizada.
- Funciona sem JavaScript (o menu fica sempre visível; o formulário usa a validação nativa do navegador).

## Tecnologias

- HTML5 semântico, CSS3 (custom properties, grid, flexbox, `clamp()`), JavaScript (ES5+, sem frameworks)
- Node.js ≥ 18 apenas para ferramentas de desenvolvimento:
  - [html-validate](https://html-validate.org/) — validação de HTML e regras de acessibilidade
  - [html-minifier-terser](https://github.com/terser/html-minifier-terser), [clean-css](https://github.com/clean-css/clean-css), [terser](https://terser.org/), [SVGO](https://svgo.dev/) — minificação
- GitHub Actions + GitHub Pages — integração e deploy contínuos

## Estrutura de pastas

```
.
├── index.html              # Página inicial
├── projetos.html           # Projetos e formas de ajudar
├── cadastro.html           # Formulário de voluntário
├── 404.html                # Página de erro
├── robots.txt
├── css/
│   └── style.css           # Estilos (tokens de cor, layout, alto contraste)
├── js/
│   ├── main.js             # Menu e alto contraste
│   └── form.js             # Máscaras e validação do formulário
├── assets/img/             # Logo e ilustrações em SVG
├── scripts/
│   ├── build.mjs           # Gera dist/ otimizado
│   └── serve.mjs           # Servidor local sem dependências
├── docs/
│   └── ACESSIBILIDADE.md   # Relatório de conformidade WCAG 2.1 AA
├── .github/
│   ├── workflows/deploy.yml
│   └── pull_request_template.md
├── CONTRIBUTING.md         # Convenções de branches, commits e PRs
└── CHANGELOG.md
```

## Instalação e execução local

**Pré-requisitos:** [Git](https://git-scm.com/) e [Node.js](https://nodejs.org/) 18 ou superior.

```bash
# 1. Clonar o repositório
git clone https://github.com/wandeilsonlobato/projeto-pratico-4.git
cd projeto-pratico-4

# 2. Instalar as dependências de desenvolvimento
npm install

# 3. Rodar localmente
npm run dev
# acesse http://localhost:3000
```

> Sem Node.js também é possível abrir `index.html` direto no navegador, já que o site é estático.

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Serve os arquivos-fonte em `http://localhost:3000` |
| `npm run lint` | Valida o HTML com as regras recomendadas e de acessibilidade do html-validate |
| `npm run build` | Gera a versão otimizada em `dist/` |
| `npm run preview` | Gera o build e serve `dist/` em `http://localhost:3000` |

Para usar outra porta: `PORT=8080 npm run dev` (no PowerShell: `$env:PORT=8080; npm run dev`).

## Build de produção

`npm run build` executa `scripts/build.mjs`, que:

1. Limpa a pasta `dist/`;
2. Minifica CSS (clean-css nível 2), JS (terser) e SVG (SVGO);
3. Minifica o HTML e adiciona um **hash de conteúdo** aos links de CSS/JS (`style.css?v=1a2b3c4d`), garantindo que o navegador baixe a versão nova após cada deploy;
4. Mostra uma tabela com o tamanho de cada arquivo antes e depois.

Otimizações de performance já presentes no código-fonte:

- Scripts com `defer` (não bloqueiam a renderização);
- Imagens em SVG, com `width`/`height` definidos (evita *layout shift*) e `loading="lazy"` fora da primeira dobra;
- Fontes do sistema (nenhum download de fonte);
- Nenhuma dependência de framework ou biblioteca no navegador.

## Deploy

O deploy é automático pelo **GitHub Actions** (`.github/workflows/deploy.yml`):

- Em **pull requests** para `main` ou `develop`: roda `lint` e `build` (verificação).
- Em **push na `main`**: roda `lint` e `build`, depois publica `dist/` no **GitHub Pages**.

### Configuração (uma única vez)

1. Crie o repositório no GitHub e envie o código (veja [CONTRIBUTING.md](CONTRIBUTING.md)).
2. No repositório, acesse **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**.
3. Faça um push na `main` (ou rode o workflow em **Actions → CI e deploy → Run workflow**).
4. O endereço aparece no resumo do workflow e em **Settings → Pages**.

### Alternativas

- **Netlify / Vercel:** comando de build `npm run build`, pasta de publicação `dist`.

## Acessibilidade

O site foi desenvolvido e revisado para atender à **WCAG 2.1 nível AA**. O relatório completo, com cada critério verificado, os problemas encontrados e as correções aplicadas, está em [docs/ACESSIBILIDADE.md](docs/ACESSIBILIDADE.md).

Destaques: contraste mínimo de 4,5:1, foco sempre visível, navegação completa por teclado, estrutura semântica com *landmarks*, formulário com rótulos, dicas e erros anunciados por leitores de tela, modo alto contraste e respeito a `prefers-reduced-motion`.

## Fluxo de trabalho com Git

Resumo (detalhes em [CONTRIBUTING.md](CONTRIBUTING.md)):

- `main` — produção (cada push gera deploy)
- `develop` — integração
- `feature/*`, `fix/*`, `a11y/*`, `docs/*` — trabalho do dia a dia, integrados via **pull request** com revisão
- Commits no padrão **Conventional Commits** (`feat:`, `fix:`, `a11y:`, `perf:`, `docs:`, `chore:`)
- Versões marcadas com **tags** semânticas (`v1.0.0`)

## Manutenção

- **Alterar textos:** edite diretamente os arquivos `.html`.
- **Alterar cores:** edite as variáveis em `:root` no início de `css/style.css`. Confira o contraste em <https://webaim.org/resources/contrastchecker/> (mínimo 4,5:1 para texto).
- **Adicionar um projeto:** copie um `<article class="card card--project">` em `projetos.html`, troque imagem, texto alternativo, título e ids (`meta-N`).
- **Adicionar uma página:** crie o `.html` a partir de uma página existente (mantendo cabeçalho, *skip link* e rodapé), adicione o link no menu das demais páginas e inclua o nome do arquivo em `PAGES` (`scripts/build.mjs`) e no script `lint` (`package.json`).
- **Antes de cada PR:** `npm run lint && npm run build` e o checklist do template de PR.
- **Atualizar dependências:** `npm outdated` e `npm update`; rode o build para confirmar.

## Licença

Distribuído sob a licença MIT. Projeto acadêmico; a ONG, os dados e os valores apresentados são fictícios.
