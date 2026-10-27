import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

/**
 * Pré-cache offline: depois do build, grava em dist/sw.js a lista de TODOS os arquivos gerados
 * (JS, CSS, fontes, ícones) e uma versão derivada do conteúdo. Assim o app inteiro fica disponível
 * sem conexão já na primeira visita, e cada deploy invalida o cache antigo.
 */
function swPrecache(): Plugin {
  let outDir = 'dist';
  return {
    name: 'sw-precache',
    apply: 'build',
    configResolved(cfg) {
      outDir = cfg.build.outDir;
    },
    closeBundle() {
      const files = listFiles(outDir)
        .map((f) => './' + relative(outDir, f).split('\\').join('/'))
        .filter((f) => f !== './sw.js' && !f.endsWith('.map') && !f.endsWith('.woff'))
        .sort();
      const hash = createHash('sha1');
      files.forEach((f) => hash.update(readFileSync(join(outDir, f))));
      const swPath = join(outDir, 'sw.js');
      const sw = readFileSync(swPath, 'utf8')
        .replace('/*__PRECACHE__*/ []', JSON.stringify(files))
        .replace('/*__VERSION__*/ ' + "'dev'", `'${hash.digest('hex').slice(0, 10)}'`);
      writeFileSync(swPath, sw);
    },
  };
}

// base './' => o build estático funciona em qualquer subpasta / CDN / file server.
export default defineConfig({
  base: './',
  plugins: [react(), swPrecache()],
  build: { target: 'es2020', sourcemap: false },
});
