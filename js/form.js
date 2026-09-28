/* =========================================================
   ONG Semear Futuro — validação acessível do formulário
   - Máscaras de CPF, telefone e CEP
   - Mensagens de erro associadas via aria-describedby
   - Resumo de erros com links para cada campo (WCAG 3.3.1 / 3.3.3)
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('form-cadastro');
  if (!form) return;

  var resumo = document.getElementById('resumo-erros');
  var sucesso = document.getElementById('sucesso');

  /* ---------- Máscaras ---------- */
  var mascaras = {
    cpf: function (v) {
      return v.replace(/\D/g, '').slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },
    telefone: function (v) {
      var d = v.replace(/\D/g, '').slice(0, 11);
      if (d.length <= 2) return d.length ? '(' + d : '';
      if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
      var meio = d.length === 11 ? 7 : 6;
      return '(' + d.slice(0, 2) + ') ' + d.slice(2, meio) + '-' + d.slice(meio);
    },
    cep: function (v) {
      return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  Object.keys(mascaras).forEach(function (id) {
    var campo = document.getElementById(id);
    campo.addEventListener('input', function () {
      campo.value = mascaras[id](campo.value);
    });
  });

  /* ---------- Regras de validação ---------- */
  function cpfValido(valor) {
    var n = valor.replace(/\D/g, '');
    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
    for (var t = 9; t < 11; t++) {
      var soma = 0;
      for (var i = 0; i < t; i++) soma += Number(n[i]) * (t + 1 - i);
      var digito = ((soma * 10) % 11) % 10;
      if (digito !== Number(n[t])) return false;
    }
    return true;
  }

  function idade(dataISO) {
    var nasc = new Date(dataISO + 'T00:00:00');
    var hoje = new Date();
    var anos = hoje.getFullYear() - nasc.getFullYear();
    var m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
    return anos;
  }

  var rotulos = {
    nome: 'Nome completo', email: 'E-mail', cpf: 'CPF', nascimento: 'Data de nascimento',
    telefone: 'Telefone', cep: 'CEP', estado: 'Estado', cidade: 'Cidade',
    endereco: 'Endereço', interesse: 'Área de interesse', termos: 'Política de privacidade'
  };

  function validarCampo(nome) {
    var campo = form.elements[nome];
    var valor = campo.value ? campo.value.trim() : '';

    switch (nome) {
      case 'nome':
        if (!valor) return 'Informe seu nome completo.';
        if (valor.length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
        return '';
      case 'email':
        if (!valor) return 'Informe seu e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Informe um e-mail válido, por exemplo: nome@exemplo.com.';
        return '';
      case 'cpf':
        if (!valor) return 'Informe seu CPF.';
        if (!cpfValido(valor)) return 'CPF inválido. Confira os 11 dígitos.';
        return '';
      case 'nascimento':
        if (!valor) return 'Informe sua data de nascimento.';
        if (idade(valor) < 16) return 'É preciso ter pelo menos 16 anos para ser voluntário.';
        return '';
      case 'telefone':
        if (!valor) return 'Informe seu telefone.';
        if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(valor)) return 'Telefone incompleto. Use o formato (11) 91234-5678.';
        return '';
      case 'cep':
        if (!valor) return 'Informe seu CEP.';
        if (!/^\d{5}-\d{3}$/.test(valor)) return 'CEP incompleto. Use o formato 00000-000.';
        return '';
      case 'estado':
        return valor ? '' : 'Selecione seu estado.';
      case 'cidade':
        return valor ? '' : 'Informe sua cidade.';
      case 'endereco':
        return valor ? '' : 'Informe seu endereço.';
      case 'interesse':
        return valor ? '' : 'Escolha uma área de interesse.';
      case 'termos':
        return campo.checked ? '' : 'É necessário aceitar a política de privacidade.';
    }
    return '';
  }

  function primeiroControle(nome) {
    var el = form.elements[nome];
    return el instanceof RadioNodeList ? el[0] : el;
  }

  function mostrarErro(nome, mensagem) {
    var erro = document.getElementById(nome + '-erro');
    var el = form.elements[nome];
    var controles = el instanceof RadioNodeList ? Array.prototype.slice.call(el) : [el];

    controles.forEach(function (c) {
      if (mensagem) c.setAttribute('aria-invalid', 'true');
      else c.removeAttribute('aria-invalid');
    });
    erro.textContent = mensagem;
    erro.hidden = !mensagem;
  }

  // Valida ao sair do campo, apenas depois que a pessoa interagiu com ele
  Object.keys(rotulos).forEach(function (nome) {
    var el = form.elements[nome];
    var controles = el instanceof RadioNodeList ? Array.prototype.slice.call(el) : [el];
    controles.forEach(function (c) {
      c.addEventListener(c.type === 'radio' || c.type === 'checkbox' ? 'change' : 'blur', function () {
        if (c.type !== 'radio' && c.type !== 'checkbox' && !c.value) return;
        mostrarErro(nome, validarCampo(nome));
      });
    });
  });

  /* ---------- Envio ---------- */
  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    sucesso.hidden = true;

    var erros = [];
    Object.keys(rotulos).forEach(function (nome) {
      var mensagem = validarCampo(nome);
      mostrarErro(nome, mensagem);
      if (mensagem) erros.push({ nome: nome, mensagem: mensagem });
    });

    if (erros.length) {
      resumo.innerHTML = '';
      var titulo = document.createElement('h2');
      titulo.textContent = erros.length === 1
        ? 'Há 1 campo a corrigir:'
        : 'Há ' + erros.length + ' campos a corrigir:';
      var lista = document.createElement('ul');

      erros.forEach(function (erro) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        var alvo = primeiroControle(erro.nome);
        link.href = '#' + alvo.id;
        link.textContent = rotulos[erro.nome] + ': ' + erro.mensagem;
        link.addEventListener('click', function (e) {
          e.preventDefault();
          alvo.focus();
        });
        item.appendChild(link);
        lista.appendChild(item);
      });

      resumo.appendChild(titulo);
      resumo.appendChild(lista);
      resumo.hidden = false;
      resumo.focus();
      return;
    }

    resumo.hidden = true;
    var nome = form.elements.nome.value.trim().split(' ')[0];
    sucesso.textContent = 'Obrigado, ' + nome + '! Seu cadastro foi recebido. Entraremos em contato em até 5 dias úteis.';
    sucesso.hidden = false;
    form.reset();
    sucesso.focus();
  });
})();
