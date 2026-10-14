'use strict';

const $ = id => document.getElementById(id);
const INGREDIENTS = {
  ovo: ['🥚', 'Ovos'], farinha: ['🌾', 'Farinha'], leite: ['🥛', 'Leite'],
  acucar: ['🍬', 'Açúcar'], chocolate: ['🍫', 'Chocolate'],
  manteiga: ['🧈', 'Manteiga'], morango: ['🍓', 'Morango']
};

const MASSA = `function fazerMassa() {\n  adicionar("farinha", 2);\n  adicionar("ovo", 3);\n}`;
const COBERTURA = `function fazerCobertura() {\n  adicionar("chocolate", 1);\n  adicionar("manteiga", 1);\n}`;
const COLOCAR = `function colocar(ingrediente, qtd) {\n  adicionar(ingrediente, qtd);\n}`;
const COLOCAR_PADRAO = `function colocar(ingrediente, qtd = 1) {\n  adicionar(ingrediente, qtd);\n}`;
const RECEITA = `function receita(sabor, ovos) {\n  adicionar("farinha", 2);\n  adicionar("ovo", ovos);\n  adicionar(sabor, 1);\n  misturar(10);\n}`;

// Cada ___ é um único espaço editável dentro do código.
const LEVELS = [
  { t: 'Chamando a receita', i: 'A função já está pronta. Chame a receita para preparar a massa.', c: MASSA + '\n\n___;', e: 'a farinha 2,a ovo 3', s: 'fazerMassa()' },
  { t: 'Receita em dobro', i: 'A cliente quer duas massas. Chame a mesma função duas vezes.', c: MASSA + '\n\n___;', e: 'a farinha 2,a ovo 3,a farinha 2,a ovo 3', s: 'fazerMassa(); fazerMassa()' },
  { t: 'A ordem importa', i: 'Prepare a cobertura primeiro e a massa depois.', c: MASSA + '\n\n' + COBERTURA + '\n\n___;', e: 'a chocolate 1,a manteiga 1,a farinha 2,a ovo 3', s: 'fazerCobertura(); fazerMassa()' },
  { t: 'Dando nome à função', i: 'O nome definido na função deve ser igual ao nome usado na chamada.', c: 'function ___() {\n  misturar(10);\n}\n\nbatedeira();', e: 'm 10', s: 'batedeira' },
  { t: 'Primeiro parâmetro', i: 'O parâmetro recebe a quantidade. Adicione 4 ovos.', c: 'function colocarOvos(qtd) {\n  adicionar("ovo", qtd);\n}\n\n___;', e: 'a ovo 4', s: 'colocarOvos(4)' },
  { t: 'Argumento de texto', i: 'Textos ficam entre aspas. Adicione uma unidade de chocolate.', c: 'function colocarUm(ingrediente) {\n  adicionar(ingrediente, 1);\n}\n\n___;', e: 'a chocolate 1', s: 'colocarUm("chocolate")' },
  { t: 'Usando o parâmetro', i: 'Use o parâmetro recebido para definir quantas vezes misturar.', c: 'function bater(vezes) {\n  misturar(___);\n}\n\nbater(8);', e: 'm 8', s: 'vezes' },
  { t: 'Declarando o parâmetro', i: 'A função usa a variável minutos. Declare esse parâmetro.', c: 'function assarBolo(___) {\n  assar(minutos, 180);\n}\n\nassarBolo(40);', e: 'f 40 180', s: 'minutos' },
  { t: 'Dois parâmetros', i: 'Passe ingrediente e quantidade. Adicione 3 unidades de açúcar; use "acucar" no código.', c: COLOCAR + '\n\n___;', e: 'a acucar 3', s: 'colocar("acucar", 3)' },
  { t: 'A ordem dos argumentos', i: 'O primeiro argumento é o ingrediente; o segundo é a quantidade. Adicione 2 leites e 3 ovos.', c: COLOCAR + '\n\n___;', e: 'a leite 2,a ovo 3', s: 'colocar("leite", 2); colocar("ovo", 3)' },
  { t: 'Reaproveitando', i: 'Use a mesma função para adicionar farinha, açúcar e manteiga.', c: COLOCAR + '\n\n___;', e: 'a farinha 2,a acucar 1,a manteiga 1', s: 'colocar("farinha", 2); colocar("acucar", 1); colocar("manteiga", 1)' },
  { t: 'Valor padrão', i: 'Defina 1 como quantidade padrão para quando ela não for informada.', c: 'function colocar(ingrediente, qtd = ___) {\n  adicionar(ingrediente, qtd);\n}\n\ncolocar("ovo");', e: 'a ovo 1', s: '1' },
  { t: 'Usando ou não o padrão', i: 'Adicione 1 ovo usando o padrão e 4 unidades de farinha informando a quantidade.', c: COLOCAR_PADRAO + '\n\n___;', e: 'a ovo 1,a farinha 4', s: 'colocar("ovo"); colocar("farinha", 4)' },
  { t: 'Variáveis como argumento', i: 'Cada convidado come 2 ovos. Use convidados para calcular a quantidade.', c: 'const convidados = 4;\n\nfunction colocarOvos(qtd) {\n  adicionar("ovo", qtd);\n}\n\ncolocarOvos(___);', e: 'a ovo 8', m: /convidados/, s: 'convidados * 2' },
  { t: 'Repassando o parâmetro', i: 'A função prepararMassa deve chamar bater e repassar o parâmetro vezes.', c: 'function bater(vezes) {\n  misturar(vezes);\n}\n\nfunction prepararMassa(vezes) {\n  adicionar("farinha", 2);\n  ___(vezes);\n}\n\nprepararMassa(6);', e: 'a farinha 2,m 6', s: 'bater' },
  { t: 'Vários sabores', i: 'Use o parâmetro sabor para preparar um bolo de morango.', c: 'function bolo(sabor) {\n  adicionar("farinha", 2);\n  adicionar(sabor, 3);\n}\n\n___;', e: 'a farinha 2,a morango 3', s: 'bolo("morango")' },
  { t: 'Devolvendo valores', i: 'Corrija a função para que ela devolva o dobro. O resultado será usado como quantidade de ovos.', c: 'function dobro(n) {\n  ___ n * 2;\n}\n\nadicionar("ovo", dobro(3));', e: 'a ovo 6', s: 'return' },
  { t: 'O que devolver', i: 'Devolva um número maior em 1 que o valor recebido.', c: 'function maisUm(n) {\n  return ___;\n}\n\nadicionar("ovo", maisUm(4));', e: 'a ovo 5', m: /n/, s: 'n + 1' },
  { t: 'Dois parâmetros e um retorno', i: 'Calcule o total de ovos: quantidade de bolos multiplicada por ovos por bolo.', c: 'function totalOvos(bolos, ovosPorBolo) {\n  return ___;\n}\n\nadicionar("ovo", totalOvos(4, 3));', e: 'a ovo 12', m: /bolos.*ovosPorBolo|ovosPorBolo.*bolos/, s: 'bolos * ovosPorBolo' },
  { t: 'Função dentro de função', i: 'Use o resultado de dobro como entrada de outra chamada. Calcule o dobro do dobro de 2.', c: 'function dobro(n) {\n  return n * 2;\n}\n\nadicionar("ovo", ___);', e: 'a ovo 8', m: /dobro\s*\(\s*dobro\s*\(/, s: 'dobro(dobro(2))' },
  { t: 'Escrevendo o corpo', i: 'Passe sabor e camadas para a função decorar.', c: 'function cobertura(sabor, camadas) {\n  ___;\n}\n\ncobertura("chocolate", 2);', e: 'd chocolate 2', s: 'decorar(sabor, camadas)' },
  { t: 'A receita completa', i: 'Chame receita para um bolo de chocolate com 3 ovos.', c: RECEITA + '\n\n___;', e: 'a farinha 2,a ovo 3,a chocolate 1,m 10', s: 'receita("chocolate", 3)' },
  { t: 'Receita e forno', i: 'Prepare bolo de morango com 2 ovos; depois asse por 35 minutos a 200 graus.', c: RECEITA + '\n\nfunction assarBolo(minutos, graus) {\n  assar(minutos, graus);\n}\n\n___;', e: 'a farinha 2,a ovo 2,a morango 1,m 10,f 35 200', s: 'receita("morango", 2); assarBolo(35, 200)' },
  { t: 'Mestre confeiteiro', i: 'Complete o corpo: adicione os ovos, uma unidade do sabor e asse pelo tempo recebido a 180 graus.', c: 'function bolo(sabor, ovos, minutos) {\n  ___\n}\n\nbolo("chocolate", 4, 45);', e: 'a ovo 4,a chocolate 1,f 45 180', s: 'adicionar("ovo", ovos); adicionar(sabor, 1); assar(minutos, 180);' }
];

let current = 0;
let completed = new Set();
let drafts = {};
let input = null;
let displayVersion = 0;
let requestId = 0;
const MAX_SOLUTION_USES = 5;
let solutionUses = 0;
const pendingRuns = new Map();
const runner = $('runner');

try {
  const saved = localStorage.getItem('funcao-bolo-progress') ?? localStorage.getItem('fb') ?? '[]';
  completed = new Set(JSON.parse(saved).filter(index => Number.isInteger(index) && index >= 0 && index < LEVELS.length));
} catch { completed = new Set(); }
try { drafts = JSON.parse(localStorage.getItem('funcao-bolo-drafts') || '{}'); } catch { drafts = {}; }
try {
  const savedUses = Number(localStorage.getItem('funcao-bolo-solution-uses'));
  solutionUses = Number.isInteger(savedUses) ? Math.min(MAX_SOLUTION_USES, Math.max(0, savedUses)) : 0;
} catch { solutionUses = 0; }

// O código é executado em um iframe isolado, sem acesso à página principal.
const runnerSource = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; connect-src 'none'; img-src 'none'; style-src 'none'; form-action 'none'; base-uri 'none'"></head><body><script>
window.addEventListener('message', function (event) {
  var data = event.data;
  if (!data || data.type !== 'run') return;
  var id = data.id;
  var log = [];
  var action = function (name) { return function () { log.push([name].concat(Array.from(arguments, String)).join(' ')); }; };
  try {
    new Function('adicionar', 'misturar', 'assar', 'decorar', data.code)(action('a'), action('m'), action('f'), action('d'));
    parent.postMessage({ type: 'result', id: id, log: log }, '*');
  } catch (error) {
    parent.postMessage({ type: 'result', id: id, log: log, error: String(error && error.message || error) }, '*');
  }
});
</script></body></html>`;
const runnerReady = new Promise(resolve => runner.addEventListener('load', resolve, { once: true }));
runner.srcdoc = runnerSource;
window.addEventListener('message', event => {
  if (event.source !== runner.contentWindow) return;
  const data = event.data;
  if (!data || data.type !== 'result' || !pendingRuns.has(data.id)) return;
  const resolve = pendingRuns.get(data.id);
  pendingRuns.delete(data.id);
  resolve({ log: Array.isArray(data.log) ? data.log : [], error: data.error || '' });
});

const escapeHTML = value => String(value).replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
function highlight(code) {
  const pattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:function|return|const|let)\b|\b\d+(?:\.\d+)?\b)/g;
  return String(code).split(pattern).map(token => {
    if (!token) return '';
    let cls = '';
    if (/^["']/.test(token)) cls = 'syntax-string';
    else if (/^(function|return|const|let)$/.test(token)) cls = 'syntax-keyword';
    else if (/^\d/.test(token)) cls = 'syntax-number';
    return cls ? `<span class="${cls}">${escapeHTML(token)}</span>` : escapeHTML(token);
  }).join('');
}

function saveState() {
  try {
    localStorage.setItem('funcao-bolo-progress', JSON.stringify([...completed]));
    localStorage.setItem('funcao-bolo-drafts', JSON.stringify(drafts));
    localStorage.setItem('funcao-bolo-solution-uses', String(solutionUses));
  } catch { /* O jogo continua funcionando se o armazenamento estiver indisponível. */ }
}

function updateSolutionCounter() {
  const exhausted = solutionUses >= MAX_SOLUTION_USES;
  $('solution-count').textContent = exhausted
    ? `Soluções usadas: ${solutionUses}/${MAX_SOLUTION_USES}. Limite atingido.`
    : `Soluções usadas: ${solutionUses}/${MAX_SOLUTION_USES}.`;
  $('solution-lamps').querySelectorAll('.solution-lamp').forEach((lamp, index) => {
    lamp.classList.toggle('used', index < solutionUses);
  });
  $('ans').disabled = exhausted;
  $('ans').title = exhausted
    ? `Você já usou as ${MAX_SOLUTION_USES} soluções disponíveis.`
    : `Você usou ${solutionUses} de ${MAX_SOLUTION_USES} soluções disponíveis.`;
}

function highestCompleted() {
  return completed.size ? Math.max(...completed) : -1;
}

function renderNav() {
  const nav = $('nav');
  nav.replaceChildren();
  const unlockedThrough = Math.min(LEVELS.length - 1, highestCompleted() + 1);
  LEVELS.forEach((level, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(index + 1);
    button.setAttribute('aria-label', `Fase ${index + 1}: ${level.t}`);
    if (index === current) button.setAttribute('aria-current', 'step');
    if (index === current) button.classList.add('active');
    if (completed.has(index)) button.classList.add('done');
    button.disabled = index > unlockedThrough;
    button.addEventListener('click', () => levelAt(index));
    nav.append(button);
  });
  $('progress').textContent = `${completed.size} de ${LEVELS.length} receitas`;
}

function makeTile(command, status = '') {
  const [type, value = '', amount = ''] = String(command).split(' ');
  let icon, label, badge;
  if (type === 'a') {
    const item = INGREDIENTS[value] || ['?', value || 'Ingrediente'];
    [icon, label] = item;
    badge = `×${amount}`;
  } else if (type === 'm') {
    icon = '🥄'; label = 'Misturar'; badge = `${value}×`;
  } else if (type === 'f') {
    icon = '♨️'; label = `Assar a ${amount}°`; badge = `${value} min`;
  } else {
    icon = '🍰'; label = `Cobertura: ${INGREDIENTS[value]?.[1] || value}`; badge = `${amount} cam.`;
  }
  const tile = document.createElement('div');
  tile.className = `tile ${status}`.trim();
  const iconNode = document.createElement('span');
  iconNode.className = 'ic'; iconNode.setAttribute('aria-hidden', 'true'); iconNode.textContent = icon;
  const labelNode = document.createElement('small'); labelNode.textContent = label;
  const badgeNode = document.createElement('b'); badgeNode.textContent = badge;
  tile.append(iconNode, labelNode, badgeNode);
  return tile;
}

function paintBoard(result, phaseIndex) {
  const expected = LEVELS[phaseIndex].e.split(',');
  const actual = $('have');
  actual.replaceChildren();
  if (!result.log.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Sua receita ainda não produziu nada.';
    actual.append(empty);
  } else {
    result.log.forEach((command, index) => actual.append(makeTile(command, command === expected[index] ? 'ok' : 'bad')));
  }
  $('err').textContent = result.error ? `Erro no código: ${result.error}` : '';
  return !result.error && result.log.join('|') === expected.join('|');
}

async function execute(code, phaseIndex) {
  await runnerReady;
  const id = ++requestId;
  const snippet = LEVELS[phaseIndex].c.replace('___', () => code);
  return new Promise(resolve => {
    pendingRuns.set(id, resolve);
    runner.contentWindow.postMessage({ type: 'run', id, code: snippet }, '*');
  });
}

async function showResult() {
  if (!input) return;
  const version = ++displayVersion;
  const phaseIndex = current;
  const code = input.value;
  const result = await execute(code, phaseIndex);
  if (version !== displayVersion || phaseIndex !== current) return;
  paintBoard(result, phaseIndex);
}

function fitInput() {
  if (!input) return;
  input.size = Math.max(3, input.value.length || 3);
}

function levelAt(index) {
  const unlockedThrough = Math.min(LEVELS.length - 1, highestCompleted() + 1);
  if (index < 0 || index >= LEVELS.length || index > unlockedThrough) return;
  if (input) drafts[current] = input.value;
  current = index;
  const level = LEVELS[index];
  $('fase').textContent = `${String(index + 1).padStart(2, '0')} / ${LEVELS.length}`;
  $('titulo').textContent = level.t;
  $('texto').textContent = level.i;
  $('cake').textContent = '';
  $('msg').replaceChildren();
  $('err').textContent = '';
  $('want').replaceChildren(...level.e.split(',').map(command => makeTile(command)));

  const [before, after] = level.c.split('___');
  $('code').innerHTML = highlight(before) + '<input id="answer" type="text" placeholder="___" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Trecho de código a completar">' + highlight(after);
  input = $('answer');
  input.value = drafts[index] || '';
  input.addEventListener('input', () => {
    drafts[current] = input.value;
    saveState(); fitInput();
    $('msg').replaceChildren(); $('cake').textContent = '';
    void showResult();
  });
  input.addEventListener('keydown', event => { if (event.key === 'Enter') checkAnswer(); });
  fitInput();
  renderNav();
  void showResult();
}

async function checkAnswer() {
  if (!input) return;
  const version = ++displayVersion;
  const phaseIndex = current;
  const code = input.value;
  const result = await execute(code, phaseIndex);
  if (version !== displayVersion || phaseIndex !== current) return;
  const resultMatches = paintBoard(result, phaseIndex);
  const level = LEVELS[phaseIndex];
  const extraRulePasses = !level.m || level.m.test(code);
  $('msg').replaceChildren();
  $('cake').textContent = '';

  if (resultMatches && extraRulePasses) {
    completed.add(phaseIndex);
    drafts[phaseIndex] = code;
    saveState();
    $('cake').textContent = '🍰';
    $('msg').textContent = phaseIndex === LEVELS.length - 1 ? 'Receita aprovada. Você concluiu as 24 fases.' : 'Receita aprovada.';
    if (phaseIndex < LEVELS.length - 1) {
      const next = document.createElement('button');
      next.type = 'button'; next.className = 'next-button'; next.textContent = 'Próxima fase →';
      next.addEventListener('click', () => levelAt(phaseIndex + 1));
      $('msg').append(' ', next);
    }
    renderNav();
  } else if (!result.error) {
    $('msg').textContent = resultMatches ? 'O resultado confere, mas use o recurso pedido no enunciado.' : 'Ainda não. Compare o pedido com o resultado da bancada.';
    $('challenge').classList.remove('shake');
    void $('challenge').offsetWidth;
    $('challenge').classList.add('shake');
  }
}

$('go').addEventListener('click', checkAnswer);
$('ans').addEventListener('click', () => {
  if (!input || solutionUses >= MAX_SOLUTION_USES) return;
  solutionUses++;
  input.value = LEVELS[current].s;
  drafts[current] = input.value;
  saveState(); fitInput(); updateSolutionCounter(); $('msg').replaceChildren(); $('cake').textContent = '';
  void showResult(); input.focus();
});
$('reset').addEventListener('click', () => {
  if (!window.confirm('Apagar o progresso e começar da primeira fase?')) return;
  completed.clear(); drafts = {}; input = null; current = 0;
  solutionUses = 0;
  try { localStorage.removeItem('fb'); } catch { /* ignorado */ }
  saveState();
  updateSolutionCounter();
  levelAt(0);
});

const malformed = LEVELS.findIndex(level => (level.c.match(/___/g) || []).length !== 1);
if (malformed !== -1) {
  $('titulo').textContent = 'Erro na configuração';
  $('texto').textContent = `A fase ${malformed + 1} precisa ter exatamente um espaço de resposta.`;
} else {
  updateSolutionCounter();
  current = Math.min(Math.max(0, highestCompleted() + 1), LEVELS.length - 1);
  levelAt(current);
}
