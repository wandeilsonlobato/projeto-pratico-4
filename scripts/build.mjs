// Gera a versão de produção em dist/:
// - minifica HTML, CSS, JS e SVG
// - adiciona hash de conteúdo aos links de CSS/JS (cache busting)
// - exibe o ganho de tamanho de cada arquivo
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CleanCSS from 'clean-css';
import { minify as minifyHtml } from 'html-minifier-terser';
import { optimize as optimizeSvg } from 'svgo';
import { minify as minifyJs } from 'terser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PAGES = ['index.html', 'projetos.html', 'cadastro.html'];

const relatorio = [];
const hashes = new Map();

function hash(conteudo) {
  return createHash('sha256').update(conteudo).digest('hex').slice(0, 8);
}

async function gravar(relativo, original, final) {
  const destino = path.join(DIST, relativo);
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, final);
  relatorio.push({ arquivo: relativo, antes: Buffer.byteLength(original), depois: Buffer.byteLength(final) });
}

async function listar(dir) {
  const itens = await readdir(path.join(ROOT, dir), { withFileTypes: true });
  return itens.filter((i) => i.isFile()).map((i) => path.posix.join(dir, i.name));
}

async function buildCss() {
  for (const arquivo of await listar('css')) {
    const original = await readFile(path.join(ROOT, arquivo), 'utf8');
    const { styles, errors } = new CleanCSS({ level: 2 }).minify(original);
    if (errors.length) throw new Error(`${arquivo}: ${errors.join('\n')}`);
    hashes.set(arquivo, hash(styles));
    await gravar(arquivo, original, styles);
  }
}

async function buildJs() {
  for (const arquivo of await listar('js')) {
    const original = await readFile(path.join(ROOT, arquivo), 'utf8');
    const { code } = await minifyJs(original, { compress: true, mangle: true });
    hashes.set(arquivo, hash(code));
    await gravar(arquivo, original, code);
  }
}

async function buildSvg() {
  for (const arquivo of await listar('assets/img')) {
    const original = await readFile(path.join(ROOT, arquivo), 'utf8');
    const { data } = optimizeSvg(original, { multipass: true, path: arquivo });
    await gravar(arquivo, original, data);
  }
}

async function buildHtml() {
  for (const pagina of PAGES) {
    const original = await readFile(path.join(ROOT, pagina), 'utf8');
    let html = original;
    for (const [arquivo, h] of hashes) {
      html = html.replaceAll(`"${arquivo}"`, `"${arquivo}?v=${h}"`);
    }
    const final = await minifyHtml(html, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true
    });
    await gravar(pagina, original, final);
  }
}

async function copiarExtras() {
  for (const arquivo of ['robots.txt', '404.html']) {
    try {
      const conteudo = await readFile(path.join(ROOT, arquivo), 'utf8');
      const final = arquivo.endsWith('.html')
        ? await minifyHtml(conteudo, { collapseWhitespace: true, conservativeCollapse: true, removeComments: true })
        : conteudo;
      await gravar(arquivo, conteudo, final);
    } catch (erro) {
      if (erro.code !== 'ENOENT') throw erro;
    }
  }
}

const inicio = performance.now();
await rm(DIST, { recursive: true, force: true });
await buildCss();
await buildJs();
await buildSvg();
await buildHtml();
await copiarExtras();

const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
const total = relatorio.reduce((acc, r) => ({ antes: acc.antes + r.antes, depois: acc.depois + r.depois }), { antes: 0, depois: 0 });
console.table(relatorio.map((r) => ({
  arquivo: r.arquivo,
  original: kb(r.antes),
  otimizado: kb(r.depois),
  economia: `${Math.round((1 - r.depois / r.antes) * 100)}%`
})));
console.log(`Total: ${kb(total.antes)} → ${kb(total.depois)} (−${Math.round((1 - total.depois / total.antes) * 100)}%) em ${Math.round(performance.now() - inicio)} ms`);
