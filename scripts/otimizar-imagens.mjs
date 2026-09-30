// Otimiza as fotos do site.
// Para cada JPG/PNG das pastas abaixo, gera duas versões WebP (800px e 1600px de largura, qualidade 80):
//   make-01.jpg  ->  make-01-800.webp  e  make-01-1600.webp
// O JPG original é mantido e continua sendo o fallback do <picture>.
//
// Roda sozinho na publicação (.github/workflows/publicar-site.yml).
// Para rodar no computador (dentro da pasta scripts): npm install (só na primeira vez) e depois npm run otimizar
// Para refazer tudo do zero:      npm run otimizar -- --forcar

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PASTAS = ["assets/img", "assets/img/portfolio", "assets/img/depoimentos"];
const IGNORAR = /^(logo|og-image|favicon|apple-touch-icon)/i; // cuidados pelo preparar-logo.mjs
const LARGURAS = [800, 1600];
const QUALIDADE = 80;
const FORCAR = process.argv.includes("--forcar");

const kb = (bytes) => (bytes / 1024).toFixed(0) + " KB";

async function existeMaisNovo(destino, origem) {
  try {
    const [d, o] = await Promise.all([stat(destino), stat(origem)]);
    return d.mtimeMs >= o.mtimeMs;
  } catch {
    return false;
  }
}

let geradas = 0;
let puladas = 0;

for (const pasta of PASTAS) {
  const dir = path.join(RAIZ, pasta);
  let arquivos;
  try {
    arquivos = await readdir(dir);
  } catch {
    continue; // pasta ainda não existe
  }

  for (const nome of arquivos) {
    if (!/\.(jpe?g|png)$/i.test(nome) || IGNORAR.test(nome)) continue;

    const origem = path.join(dir, nome);
    const base = origem.replace(/\.(jpe?g|png)$/i, "");
    const meta = await sharp(origem).metadata();
    // Fotos de celular podem vir "deitadas" com a rotação só no EXIF
    const largura = meta.orientation >= 5 ? meta.height : meta.width;
    if (largura < 1600) {
      console.warn(`  aviso: ${pasta}/${nome} tem ${largura}px de largura. O ideal é 1600px ou mais.`);
    }

    for (const alvo of LARGURAS) {
      const destino = `${base}-${alvo}.webp`;
      if (!FORCAR && (await existeMaisNovo(destino, origem))) {
        puladas++;
        continue;
      }
      const info = await sharp(origem)
        .rotate()
        .resize({ width: alvo, withoutEnlargement: true })
        .webp({ quality: QUALIDADE })
        .toFile(destino);
      geradas++;
      console.log(`  ok  ${path.relative(RAIZ, destino)}  (${info.width}x${info.height}, ${kb(info.size)})`);
    }
  }
}

console.log(`\nPronto: ${geradas} imagem(ns) WebP gerada(s), ${puladas} já estavam atualizadas.`);
