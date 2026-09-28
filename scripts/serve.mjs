// Servidor estático mínimo para desenvolvimento local (sem dependências).
// Uso: node scripts/serve.mjs [pasta]   → http://localhost:3000
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const pasta = path.resolve(process.argv[2] ?? '.');
const porta = Number(process.env.PORT) || 3000;

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let arquivo = path.join(pasta, url.endsWith('/') ? `${url}index.html` : url);

  if (!arquivo.startsWith(pasta)) {
    res.writeHead(403).end('Acesso negado');
    return;
  }

  try {
    const conteudo = await readFile(arquivo);
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] ?? 'application/octet-stream' });
    res.end(conteudo);
  } catch {
    try {
      arquivo = path.join(pasta, '404.html');
      res.writeHead(404, { 'Content-Type': tipos['.html'] }).end(await readFile(arquivo));
    } catch {
      res.writeHead(404).end('Não encontrado');
    }
  }
}).listen(porta, () => {
  console.log(`Servindo ${pasta} em http://localhost:${porta}`);
});
