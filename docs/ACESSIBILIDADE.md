# Relatório de acessibilidade — WCAG 2.1 nível AA

Este documento registra como o site atende a cada critério relevante da WCAG 2.1 (níveis A e AA), como testar e quais limitações conhecidas existem.

## 1. Ferramentas e métodos de verificação

| Método | Como executar |
|---|---|
| Validação automática de HTML + regras a11y | `npm run lint` (html-validate com `html-validate:a11y`) — roda também no CI a cada PR |
| Lighthouse | Chrome DevTools → aba **Lighthouse** → categoria **Accessibility** |
| axe DevTools / WAVE | Extensões gratuitas do navegador, executadas em cada página |
| Teclado | Navegar pelas 3 páginas usando só Tab, Shift+Tab, Enter, Espaço, setas e Esc |
| Leitor de tela | NVDA (Windows) ou TalkBack (Android): ler cada página e preencher o formulário |
| Zoom | Zoom do navegador a 200% e 400% (largura de 320 px) |
| Contraste | [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) para cada par de cores |

### Resultados das ferramentas

Lighthouse 12 no site publicado (v1.0.1), em 28/09/2026:

| Página | Dispositivo | Acessibilidade | Performance | Boas práticas | SEO |
|---|---|---|---|---|---|
| Início | Celular | 100 | 88 | 100 | 100 |
| Início | Desktop | 100 | 100 | 100 | 100 |
| Projetos | Celular | 100 | 88 | 100 | 100 |
| Projetos | Desktop | 100 | 100 | 100 | 100 |
| Cadastro | Celular | 100 | 87 | 100 | 100 |
| Cadastro | Desktop | 100 | 100 | 100 | 100 |

A performance no celular foi reduzida por um *layout shift* (CLS 0,236) causado pelo menu. Após a correção (PR #6), o build medido localmente ficou com CLS 0 e performance de 96 a 100 no celular.

## 2. Critérios atendidos

### Perceptível

| Critério | Nível | Implementação |
|---|---|---|
| 1.1.1 Conteúdo não textual | A | Todas as ilustrações têm `alt` descritivo; o logo ao lado do nome da ONG usa `alt=""` por ser decorativo (o nome já está no link); ícones decorativos têm `aria-hidden="true"`. |
| 1.3.1 Informações e relações | A | Landmarks (`header`, `nav`, `main`, `footer`), hierarquia de títulos h1→h2→h3 sem saltos, tabela com `caption`, `th scope`, formulário com `fieldset`/`legend` e `label for`. |
| 1.3.2 Sequência significativa | A | Ordem do DOM igual à ordem visual. |
| 1.3.4 Orientação | AA | Layout funciona em retrato e paisagem. |
| 1.3.5 Identificar o propósito da entrada | AA | Atributos `autocomplete` (`name`, `email`, `tel`, `bday`, `postal-code`, `address-level1/2`, `street-address`). |
| 1.4.1 Uso de cor | A | Erros com ícone ⚠ e texto, não apenas borda vermelha; página atual do menu com sublinhado, não só cor. |
| 1.4.3 Contraste (mínimo) | AA | Texto `#1f2933` / branco = 14,7:1; primária `#0b6e4f` / branco = 6,3:1; link `#0a58a8` / branco = 6,6:1; erro `#b3261e` / branco = 6,5:1; texto secundário `#4a5560` = 7,6:1. |
| 1.4.4 Redimensionar texto | AA | Tamanhos em `rem`/`clamp()`; nada é cortado com zoom de 200%. |
| 1.4.10 Reflow | AA | Sem rolagem horizontal a 320 px de largura (grid com `auto-fit`, menu recolhível). |
| 1.4.11 Contraste não textual | AA | Bordas de campos e botões `#6b7680` = 4,7:1; contorno de foco `#0a3d91` com 3 px. |
| 1.4.12 Espaçamento de texto | AA | Sem alturas fixas em contêineres de texto. |
| 1.4.13 Conteúdo em hover/foco | AA | Não há tooltips nem conteúdo que apareça só no hover. |

### Operável

| Critério | Nível | Implementação |
|---|---|---|
| 2.1.1 Teclado | A | Todos os controles são elementos nativos (`a`, `button`, `input`, `details`). Menu abre com Enter/Espaço. |
| 2.1.2 Sem bloqueio de teclado | A | Nenhuma armadilha de foco; Esc fecha o menu e devolve o foco ao botão. |
| 2.4.1 Ignorar blocos | A | Link "Pular para o conteúdo principal", primeiro item focável de cada página. |
| 2.4.2 Página com título | A | `<title>` único por página no formato "Página \| ONG Semear Futuro". |
| 2.4.3 Ordem do foco | A | Segue a ordem visual; após enviar o formulário o foco vai para o resumo de erros ou para a mensagem de sucesso. |
| 2.4.4 Finalidade do link | A | Textos de link descritivos ("Apoiar o Prato Cheio" em vez de "Saiba mais"). |
| 2.4.5 Várias formas | AA | Menu principal em todas as páginas e trilha de navegação (breadcrumb). |
| 2.4.6 Cabeçalhos e rótulos | AA | Títulos e rótulos descrevem o conteúdo. |
| 2.4.7 Foco visível | AA | `:focus-visible` com contorno de 3 px e afastamento de 3 px em todos os elementos. |
| 2.5.3 Rótulo no nome acessível | A | O nome acessível dos botões contém o texto visível. |
| 2.3.3 Animação por interação (AAA, bônus) | AAA | `prefers-reduced-motion` desliga transições e rolagem suave. |

Tamanho de alvo: botões, links do menu e opções do formulário têm no mínimo 44 × 44 px.

### Compreensível

| Critério | Nível | Implementação |
|---|---|---|
| 3.1.1 Idioma da página | A | `<html lang="pt-BR">`. |
| 3.2.1 / 3.2.2 Em foco / Em entrada | A | Nenhuma mudança de contexto ao focar ou digitar; o formulário só é enviado pelo botão. |
| 3.2.3 Navegação consistente | AA | Cabeçalho, menu e rodapé idênticos nas três páginas. |
| 3.2.4 Identificação consistente | AA | Componentes iguais com o mesmo nome em todas as páginas. |
| 3.3.1 Identificação do erro | A | Cada erro aparece em texto junto ao campo, com `aria-invalid="true"`. |
| 3.3.2 Rótulos ou instruções | A | Todo campo tem `label`; formatos esperados indicados em dicas ligadas por `aria-describedby`; aviso sobre campos obrigatórios. |
| 3.3.3 Sugestão de erro | AA | Mensagens dizem como corrigir ("Use o formato (11) 91234-5678"). |
| 3.3.4 Prevenção de erros | AA | Validação completa antes do envio e resumo com links que levam direto a cada campo com erro. |

### Robusto

| Critério | Nível | Implementação |
|---|---|---|
| 4.1.1 Análise | A | HTML validado automaticamente no CI. |
| 4.1.2 Nome, função, valor | A | Estados expostos com `aria-expanded` (menu), `aria-pressed` (alto contraste), `aria-current` (página atual). |
| 4.1.3 Mensagens de status | AA | Resumo de erros com `role="alert"` e mensagem de sucesso com `role="status"`, anunciados pelo leitor de tela. |

## 3. Recursos adicionais

- **Modo alto contraste** (amarelo/branco sobre preto), com a preferência salva.
- **Funciona sem JavaScript**: o menu fica sempre visível e o formulário usa a validação nativa do navegador.
- **Impressão**: cabeçalho e rodapé são ocultados em `@media print`.

## 4. Problemas encontrados na revisão e correções

| Problema | Critério | Correção |
|---|---|---|
| Grupo de opções "Área de interesse" usava `role="radiogroup"` dentro de um `fieldset`, duplicando o agrupamento anunciado pelo leitor de tela | 4.1.2 | Removido o `role`; o `fieldset`/`legend` nativo já agrupa, e a mensagem de erro foi ligada ao `fieldset` por `aria-describedby`. |
| Botões de opção sem `id`, o que impedia que o link do resumo de erros levasse o foco até eles | 2.4.3 / 3.3.1 | Adicionados `id` a cada opção; o link do resumo foca a primeira. |
| Menu abria e fechava no carregamento em telas pequenas, deslocando o conteúdo (CLS 0,236 no Lighthouse) | 2.4.3 / desempenho | Remoção da classe `no-js` movida para um script inline no `<head>`, antes da primeira pintura (PR #6). |
| Menu recolhido ficaria inacessível se o JavaScript falhasse | 2.1.1 | Classe `no-js` no `<html>`, removida pelo script; sem JS o menu permanece aberto. |

Registre aqui os novos problemas encontrados pelo Lighthouse, pelo axe ou nos testes manuais, junto com o commit que os corrigiu.

## 5. Limitações conhecidas

- O formulário é demonstrativo: os dados não são enviados a nenhum servidor.
- O modo alto contraste aplica tons de cinza às ilustrações; as imagens continuam compreensíveis pelo texto alternativo.
- Testes com leitor de tela devem ser repetidos a cada mudança significativa de interface.
