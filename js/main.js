/* =========================================================
   ONG Semear Futuro — comportamentos globais
   - Menu responsivo acessível (aria-expanded, tecla Esc)
   - Alternância de alto contraste com preferência salva
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;

  var CHAVE_CONTRASTE = 'semear:contraste';

  function lerPreferencia() {
    try { return localStorage.getItem(CHAVE_CONTRASTE); } catch (e) { return null; }
  }

  function salvarPreferencia(valor) {
    try { localStorage.setItem(CHAVE_CONTRASTE, valor); } catch (e) { /* armazenamento indisponível */ }
  }

  function aplicarContraste(ativo, botao) {
    if (ativo) {
      root.setAttribute('data-contraste', 'alto');
    } else {
      root.removeAttribute('data-contraste');
    }
    if (botao) botao.setAttribute('aria-pressed', String(ativo));
  }

  function iniciarContraste() {
    var botao = document.querySelector('.contrast-toggle');
    aplicarContraste(lerPreferencia() === 'alto', botao);
    if (!botao) return;

    botao.addEventListener('click', function () {
      var ativo = botao.getAttribute('aria-pressed') !== 'true';
      aplicarContraste(ativo, botao);
      salvarPreferencia(ativo ? 'alto' : 'normal');
    });
  }

  function iniciarMenu() {
    var botao = document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu-principal');
    if (!botao || !menu) return;

    function definirAberto(aberto) {
      botao.setAttribute('aria-expanded', String(aberto));
      menu.classList.toggle('is-open', aberto);
    }

    botao.addEventListener('click', function () {
      definirAberto(botao.getAttribute('aria-expanded') !== 'true');
    });

    // Esc fecha o menu e devolve o foco ao botão
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
        definirAberto(false);
        botao.focus();
      }
    });
  }

  iniciarContraste();
  iniciarMenu();
})();
